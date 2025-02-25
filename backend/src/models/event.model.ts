import { Prisma, PrismaClient } from "@prisma/client";
import { error } from "console";
import necessitiesModel from "../models/necessities.model";
import participantNecessitiesModel from "../models/participantNecessities.model";
import Event from "../types/event";

const prisma = new PrismaClient();

type Necessity = { item: string };

// Fetch event infomation by id
const fetchEventById = async (id: number) => {
  const event = await prisma.events.findUnique({
    where: { id },
  });
  return event;
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

export default {
  fetchEventById,
  createNewNecessitiesInfo,
};
