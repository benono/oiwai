import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../errors/notfound.error";

const prisma = new PrismaClient();

const fetchUSerById = async (id: number) => {
  const user = await prisma.users.findUnique({
    where: { id },
    include: {
      userFamilies: {
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
    where: {
      email: email,
    },
    include: {
      userFamilies: {
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
    },
  });
  return addedUser;
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
  addNewUser,
  checkIsEventHost,
};
