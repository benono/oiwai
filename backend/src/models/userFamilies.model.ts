import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//get user_families
const fetchUserFamilyByUserId = async (userId: number) => {
  const users = await prisma.userFamilies.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
  });
  return users;
};

//insert to user_families
const addNewUserFamily = async (
  tx: Prisma.TransactionClient,
  newUserId: number,
  newName: string,
  newProfileImageUrl?: string,
) => {
  const addedEventParticipant = await tx.userFamilies.create({
    data: {
      userId: newUserId,
      name: newName,
      profileImageUrl: newProfileImageUrl ? newProfileImageUrl : "",
      isDeleted: false,
    },
  });
  return addedEventParticipant;
};

const updateUserFamily = async (
  tx: Prisma.TransactionClient,
  userFamilyId: number,
  updates: { name?: string; profileImageUrl?: string },
) => {
  if (Object.keys(updates).length === 0) {
    throw new Error("no update needed");
  }

  const userFamily = await tx.userFamilies.update({
    where: { id: userFamilyId },
    data: { ...updates },
  });

  return userFamily;
};

const deleteUserFamily = async (user_family_id: number) => {
  await prisma.userFamilies.update({
    where: { id: user_family_id },
    data: { isDeleted: true },
  });
};

export default {
  addNewUserFamily,
  fetchUserFamilyByUserId,
  updateUserFamily,
  deleteUserFamily,
};
