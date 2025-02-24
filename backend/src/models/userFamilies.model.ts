import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//get user_families
const fetchUserFamilyByUserId = async (userId: number) => {
  const users = await prisma.userFamilies.findMany({
    where: {
      userId: userId,
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

export default {
  addNewUserFamily,
  fetchUserFamilyByUserId,
};
