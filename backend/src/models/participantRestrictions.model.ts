import { PrismaClient, Prisma} from "@prisma/client";

const prisma = new PrismaClient()

//insert to event_participants
const addNewParticipantRestriction = async (tx: Prisma.TransactionClient, newEventId: number, newUserId: number, newNote: string) => {
    const addedParticipantRestriction = await prisma.participantRestrictions.create({
        data: {
        eventId: newEventId,
        userId: newUserId,
        note: newNote

        },
    });
return addedParticipantRestriction
}

export default {
    addNewParticipantRestriction,
}