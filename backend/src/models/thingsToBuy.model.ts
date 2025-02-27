import { Prisma, PrismaClient } from "@prisma/client";
import { ValidationError } from "../errors/validation.error";

const prisma = new PrismaClient();

const fetchToBuyItems = async (eventId: number) => {
  const Items = await prisma.thingsToBuy.findMany({
    where: { eventId: eventId },
    orderBy: { id: "asc" },
  });
  return Items;
};

const createToBuyItemWithTransaction = async (
  tx: Prisma.TransactionClient,
  eventId: number,
  name: string,
  price: number,
  quantity: number,
) => {
  const createdItem = await tx.thingsToBuy.create({
    data: {
      eventId: eventId,
      item: name,
      price: price,
      quantity: quantity,
      isPurchase: false,
    },
  });
  return createdItem;
};

const createToBuyItemWithoutTransaction = async (
  eventId: number,
  name: string,
  price: number,
  quantity: number,
) => {
  const createdItem = await prisma.thingsToBuy.create({
    data: {
      eventId: eventId,
      item: name,
      price: price,
      quantity: quantity,
      isPurchase: false,
    },
  });
  return createdItem;
};

const updateCheckForToBuyItems = async (
  itemId: number,
  isPurchased: boolean,
) => {
  const item = await prisma.thingsToBuy.findUnique({
    where: { id: itemId },
  });
  if (!item) {
    throw new ValidationError("Item not found");
  }

  const updatedItem = await prisma.thingsToBuy.update({
    where: { id: itemId },
    data: {
      isPurchase: isPurchased,
    },
  });
  return updatedItem;
};

const updateToBuyItems = async (
  itemId: number,
  name: string,
  price: number,
  quantity: number,
) => {
  const item = await prisma.thingsToBuy.findUnique({
    where: { id: itemId },
  });
  if (!item) {
    throw new ValidationError("Item not found");
  }

  const updatedItem = await prisma.thingsToBuy.update({
    where: { id: itemId },
    data: {
      item: name,
      price: price,
      quantity: quantity,
    },
  });
  return updatedItem;
};

const deleteToBuyItems = async (itemId: number) => {
  const item = await prisma.thingsToBuy.findUnique({
    where: { id: itemId },
  });
  if (!item) {
    throw new ValidationError("Item not found");
  }
  const deletedItem = await prisma.thingsToBuy.delete({
    where: { id: itemId },
  });
  return deletedItem;
};

export default {
  fetchToBuyItems,
  createToBuyItemWithTransaction,
  createToBuyItemWithoutTransaction,
  updateCheckForToBuyItems,
  updateToBuyItems,
  deleteToBuyItems,
};
