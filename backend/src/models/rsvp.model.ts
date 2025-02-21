import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

// Fetch event infomation by id
const fetchEventById = async (id: number) => {
    const event = await prisma.events.findUnique({
      where: { id },
    })
    return event
  }

  const fetchUSerById = async (id: number) => {
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        userFamilies: {
          select: {
            id: true,
            profileImageUrl: true,
            name: true 
          },
        },
      },
    })
    return user
  }

  const fetchUSerByEmail = async (email: string) => {
    const user = await prisma.users.findUnique({
      where: {
        email: "example@example.com",
      },
    });
  }

  //insert to user
  const addNewUser = async (newEmail: string, newName: string, newProfileImageUrl: string) => {
    const addedUser = await prisma.users.create({
      data: {
        name: newEmail,
        email: newName,
        profileImageUrl: newProfileImageUrl
      },
    });
    return addedUser
    //console.log(`Created user: ${user1.name}`);
  }

  //insert to event_participants

  //insert to user_families

  //insert to participant_restrictions

  //

export default {
    fetchEventById,
    fetchUSerById,
    fetchUSerByEmail,
    addNewUser
  }