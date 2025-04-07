import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../errors/notfound.error";

const prisma = new PrismaClient();

const maskEmail = process.env.MASK_EMAIL || "**********";

const fetchUSerById = async (id: number) => {
  const user = await prisma.users.findUnique({
    where: { id: id, isDeleted: false },
    include: {
      userFamilies: {
        where: { isDeleted: false },
        select: {
          id: true,
          profileImageUrl: true,
          name: true,
        },
      },
    },
  });
  return user;
};

const fetchUSerByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email: email, isDeleted: false },
    include: {
      userFamilies: {
        where: { isDeleted: false },
        select: {
          id: true,
          profileImageUrl: true,
          name: true,
        },
      },
    },
  });
  return user;
};

const getEventInfoByEmail = async (email: string) => {
  const eventInfo = await prisma.$queryRaw`
      SELECT distinct e.id, false As "isHost", e.title,
            e.thumbnail_url As "thumbnailUrl",
            e.start_time As "startTime",
            e.end_time As "endTime"
      FROM events e
      LEFT JOIN event_participants p
      ON p.event_id = e.id
      LEFT JOIN users participant_u
      ON participant_u.id = p.user_id
      WHERE participant_u.email = ${email}
      UNION
      SELECT e.id,  true as "isHost", e.title,
            e.thumbnail_url As "thumbnailUrl",
            e.start_time As "startTime",
            e.end_time AS "endTime"
      FROM events e
      LEFT JOIN users host_u
      ON host_u.id = e.host_id
      WHERE host_u.email = ${email}`;
  return eventInfo;
};

//insert to user
const addNewUser = async (
  tx: Prisma.TransactionClient,
  newEmail: string,
  newName: string,
  newProfileImageUrl?: string,
) => {
  const addedUser = await tx.users.create({
    data: {
      name: newName,
      email: newEmail,
      profileImageUrl: newProfileImageUrl ? newProfileImageUrl : "",
      isDeleted: true,
    },
  });
  return addedUser;
};

const updateUser = async (
  tx: Prisma.TransactionClient,
  userId: number,
  updates: { name?: string; profileImageUrl?: string },
) => {
  if (Object.keys(updates).length === 0) {
    throw new Error("no update needed");
  }

  const user = await prisma.users.update({
    where: { id: userId },
    data: { ...updates },
  });

  return user;
};

const deleteUser = async (userId: number, email: string) => {
  await prisma.$transaction(async (tx) => {
    const maskedEmail = maskEmail + email;
    await tx.users.update({
      where: { id: userId },
      data: { email: maskedEmail, isDeleted: true },
    });

    await tx.userFamilies.updateMany({
      where: { userId: userId },
      data: { isDeleted: true },
    });
  });
};

const checkIsEventHost = async (
  email: string,
  eventId: number,
): Promise<boolean> => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new NotFoundError("User");
  }
  const isHost = await prisma.events.findFirst({
    where: {
      id: eventId,
      hostId: user.id,
    },
  });
  if (!isHost) {
    return false;
  }
  return true;
};

export default {
  fetchUSerById,
  fetchUSerByEmail,
  getEventInfoByEmail,
  addNewUser,
  updateUser,
  deleteUser,
  checkIsEventHost,
};
