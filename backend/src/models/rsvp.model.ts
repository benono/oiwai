import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

// Fetch event infomation by id
const fetchEventById = async (id: number) => {
    return await prisma.events.findUnique({
      where: { id },
    })
  }

  const fetchUSerById = async (id: number) => {
    return await prisma.users.findUnique({
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
  }

  const fetchUSerByEmail = async (email: string) => {
    return await prisma.users.findUnique({ where: { email: email } });
  }

export default {
    fetchEventById,
    fetchUSerById,
    fetchUSerByEmail,
  }