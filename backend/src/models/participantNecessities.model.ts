import { PrismaClient, Prisma} from "@prisma/client";

const prisma = new PrismaClient()

//insert to participant_necessities
const addNewParticipantNecessitiesByRsvp = async (tx: Prisma.TransactionClient, eventId: number, userId: number) => {
    const addedParticipantRestriction = await prisma.$queryRaw
    `insert into participant_necessities (necessity_id, user_id, is_added) 
    select id, ${userId}, false from necessities where event_id = ${eventId}`;
    return addedParticipantRestriction
}

export default {
    addNewParticipantNecessitiesByRsvp,
}