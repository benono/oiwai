import { PrismaClient, Prisma} from "@prisma/client";

const prisma = new PrismaClient()

// Fetch event infomation by id
const fetchEventById = async (tx: Prisma.TransactionClient, id: number) => {
    const event = await prisma.events.findUnique({
      where: { id },
    })
    return event
  }

export default {
    fetchEventById,
}