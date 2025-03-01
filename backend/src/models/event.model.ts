import { Prisma, PrismaClient } from "@prisma/client";
import { error } from "console";
import { NotFoundError, ValidationError } from "../errors";
import necessitiesModel from "../models/necessities.model";
import participantNecessitiesModel from "../models/participantNecessities.model";
import Event from "../types/event";
import toBuyModel from "./thingsToBuy.model";

const prisma = new PrismaClient();

type Necessity = { item: string };

// Fetch event infomation by id
const fetchEventById = async (id: number) => {
  const event = await prisma.events.findUnique({
    where: { id },
  });
  return event;
};

const checkIsEventHostOrParticipant = async (
  email: string,
  eventId: number,
) => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new NotFoundError("User");
  }
  // check if the user is the host of the event
  const isHost = await prisma.events.findFirst({
    where: {
      id: eventId,
      hostId: user.id,
    },
  });
  if (isHost) {
    return true;
  }
  // check if the user is a participant of the event
  const isParticipant = await prisma.eventParticipants.findFirst({
    where: { eventId, userId: user.id },
  });
  return isParticipant ? true : false;
};

const updateEvent = async (
  tx: Prisma.TransactionClient,
  eventId: number,
  updates: Partial<Event>,
) => {
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined),
  );

  if (Object.keys(filteredUpdates).length === 0) {
    throw new Error("no valid update fields");
  }

  const user = await prisma.events.update({
    where: { id: eventId },
    data: { ...filteredUpdates },
  });

  return user;
};

const updateEventWithoutTransaction = async (
  eventId: number,
  updates: Partial<Event>,
) => {
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined),
  );

  if (Object.keys(filteredUpdates).length === 0) {
    throw new Error("no valid update fields");
  }

  const user = await prisma.events.update({
    where: { id: eventId },
    data: { ...filteredUpdates },
  });

  return user;
};

const createNewNecessitiesInfo = async (
  eventId: number,
  newNessitiesList: Necessity[],
  newNote: string,
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      let necessities = [];
      if (newNessitiesList.length) {
        for (let i = 0; i < newNessitiesList.length; i++) {
          const newNessity = await necessitiesModel.createNewNecessities(
            tx,
            eventId,
            newNessitiesList[i].item,
          );
          necessities.push(newNessity);
          await participantNecessitiesModel.createNewParticipantNecessities(
            tx,
            eventId,
            newNessity.id,
          );
        }
      }
      const updates = { noteForNecessities: newNote };
      const updatedNote = await updateEvent(tx, eventId, updates);
      const resultNote = updatedNote.noteForNecessities;

      return { necessities, updatedNote };
    });
  } catch (err) {
    console.error("Transaction failed:", error);
    throw error;
  }
};

const addToBuyItemInit = async (
  eventId: number,
  budget: number,
  name: string,
  price: number,
  quantity: number,
) => {
  return await prisma.$transaction(async (tx) => {
    // check if event exists
    const event = await prisma.events.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new ValidationError("Event not found");
    }
    const updates: Partial<Event> = { budget: budget };
    const updatedBudget = await updateEvent(tx, eventId, updates);

    const createdItem = await toBuyModel.createToBuyItemWithTransaction(
      tx,
      eventId,
      name,
      price,
      quantity,
    );

    return { updatedBudget, createdItem };
  });
};

export default {
  fetchEventById,
  updateEvent,
  updateEventWithoutTransaction,
  createNewNecessitiesInfo,
  addToBuyItemInit,
  checkIsEventHostOrParticipant,
};
