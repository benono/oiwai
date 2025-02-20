import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

// Fetch all courses
const fetchAllUsers = async () => {
  return await prisma.users.findMany()
}

export default {
  fetchAllUsers,
  }