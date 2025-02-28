import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../errors";

const prisma = new PrismaClient();

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

export default {
  fetchEventById,
  checkIsEventHostOrParticipant,
};
