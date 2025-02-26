import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchToBuyItems = async (eventId: number) => {
  const Items = await prisma.thingsToBuy.findMany({
    where: { eventId: eventId },
  });
  return Items;
};

export default {};
