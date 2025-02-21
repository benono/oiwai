import { PrismaClient, Prisma} from "@prisma/client";

const prisma = new PrismaClient()

//insert to user_families
const addNewUserFamily = async (tx: Prisma.TransactionClient, newUserId: number, newName: string, newProfileImageUrl?: string) => {
    const addedEventParticipant = await prisma.userFamilies.create({
        data: {
        userId: newUserId,
        name: newName,
        profileImageUrl: newProfileImageUrl? newProfileImageUrl: ""
        },
    });
return addedEventParticipant
}

export default {
    addNewUserFamily,
}