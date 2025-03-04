import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../errors";

const prisma = new PrismaClient();

const fetchToBuyItems = async (eventId: number) => {
  const Items = await prisma.thingsToBuy.findMany({
    where: { eventId: eventId },
    orderBy: { id: "asc" },
  });
  return Items;
};

const fetchToBuyItem = async (itemId: number) => {
  const Item = await prisma.thingsToBuy.findUnique({
    where: { id: itemId },
  });
  return Item;
};

const createToBuyItemWithTransaction = async (
  tx: Prisma.TransactionClient,
  eventId: number,
  item: string,
  price: number,
  quantity: number,
) => {
  const createdItem = await tx.thingsToBuy.create({
    data: {
      eventId: eventId,
      item: item,
      price: price,
      quantity: quantity,
      isPurchase: false,
    },
  });
  return createdItem;
};

const createToBuyItemWithoutTransaction = async (
  eventId: number,
  item: string,
  price: number,
  quantity: number,
) => {
  const createdItem = await prisma.thingsToBuy.create({
    data: {
      eventId: eventId,
      item: item,
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
  const itemResult = await prisma.thingsToBuy.findUnique({
    where: { id: itemId },
  });
  if (!itemResult) {
    throw new NotFoundError("Item not found");
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
  item: string,
  price: number,
  quantity: number,
) => {
  const itemResult = await prisma.thingsToBuy.findUnique({
    where: { id: itemId },
  });
  if (!itemResult) {
    throw new NotFoundError("Item not found");
  }

  const updatedItem = await prisma.thingsToBuy.update({
    where: { id: itemId },
    data: {
      item: item,
      price: price,
      quantity: quantity,
    },
  });
  return updatedItem;
};

const deleteToBuyItems = async (itemId: number) => {
  const itemResult = await prisma.thingsToBuy.findUnique({
    where: { id: itemId },
  });
  if (!itemResult) {
    throw new NotFoundError("Item not found");
  }
  const deletedItem = await prisma.thingsToBuy.delete({
    where: { id: itemId },
  });
  return deletedItem;
};

export default {
  fetchToBuyItems,
  fetchToBuyItem,
  createToBuyItemWithTransaction,
  createToBuyItemWithoutTransaction,
  updateCheckForToBuyItems,
  updateToBuyItems,
  deleteToBuyItems,
};
