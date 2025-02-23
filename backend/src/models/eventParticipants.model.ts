import { Prisma } from "@prisma/client";

//insert to event_participants
const addNewEventParticipant = async (
  tx: Prisma.TransactionClient,
  newEventId: number,
  newUserId: number,
  newMessage: string,
  newNote: string,
  newIsAccepted: boolean,
  newUserFamilyId?: number,
) => {
  const addedEventParticipant = await tx.eventParticipants.create({
    data: {
      eventId: newEventId,
      userId: newUserId,
      userFamilyId: newUserFamilyId ? newUserFamilyId : null,
      messageToHost: newMessage,
      restrictionNote: newNote,
      isAccepted: newIsAccepted,
      isAttended: false,
    },
  });
  return addedEventParticipant;
};

export default {
  addNewEventParticipant,
};
