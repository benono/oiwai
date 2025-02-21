import { PrismaClient, Prisma} from "@prisma/client";

const prisma = new PrismaClient()

// Fetch all courses
const fetchAllUsers = async () => {
  return await prisma.users.findMany()
}

const fetchUSerById = async (id: number) => {
  const user = await prisma.users.findUnique({
    where: { id },
    include: {
      userFamilies: {
        select: {
          id: true,
          profileImageUrl: true,
          name: true 
        },
      },
    },
  })
  return user
}

const fetchUSerByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return user
}

//insert to user
const addNewUser = async (tx: Prisma.TransactionClient, newEmail: string, newName: string, newProfileImageUrl?: string) => {
  const addedUser = await prisma.users.create({
    data: {
      name: newEmail,
      email: newName,
      profileImageUrl: newProfileImageUrl? newProfileImageUrl: ''
    },
  });
  return addedUser
}

export default {
  fetchAllUsers,
  fetchUSerById,
  fetchUSerByEmail,
  addNewUser,
  }