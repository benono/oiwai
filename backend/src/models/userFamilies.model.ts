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
    },
  });
  return addedEventParticipant;
};

export default {
  addNewUserFamily,
  fetchUserFamilyByUserId,
};
