import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedBen() {
  // User 4 (Ben)
  const user4 = await prisma.users.upsert({
    where: { email: "bentoki.1213@gmail.com" },
    update: {},
    create: {
      name: "Ben",
      email: "bentoki.1213@gmail.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
      userFamilies: {
        create: [
          {
            id: 10,
            name: "Amane",
            profileImageUrl:
              "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
            isDeleted: false,
          },
          {
            id: 11,
            name: "Chika",
            profileImageUrl:
              "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
            isDeleted: false,
          },
        ],
      },
    },
  });
  // User 5 (Naoya)
  const user5 = await prisma.users.upsert({
    where: { email: "naoya@test.com" },
    update: {},
    create: {
      name: "Naoya",
      email: "naoya@test.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
    },
  });

  // User 6 (Taro)
  const user6 = await prisma.users.upsert({
    where: { email: "taro@test.com" },
    update: {},
    create: {
      name: "Taro",
      email: "taro@test.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
    },
  });

  const user7 = await prisma.users.upsert({
    where: { email: "yuki@test.com" },
    update: {},
    create: {
      name: "Yuki",
      email: "yuki@test.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
    },
  });

  // Event 3 (Ben's party)
  const event3 = await prisma.events.upsert({
    where: {
      id: 3,
    },
    update: {},
    create: {
      hostId: user4.id,
      title: "Amane's 3th birthday party",
      thumbnailUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      startTime: new Date("2025-04-03T12:00:00.000Z"),
      endTime: new Date("2025-04-03T17:00:00.000Z"),
      address: "V6Z 1L2 Canada, BC, Vancouver, 978 Granvill St",
      latitude: 49.27952393542969,
      longitude: -123.122483396198,
      isAskRestrictions: false,
      theme: "#7fffd4",
      noteForThingsToBuy: "",
      noteForNecessities: "",
    },
  });

  // Participant for Event 3
  await prisma.eventParticipants.upsert({
    where: {
      id: user5.id,
    },
    update: {},
    create: {
      eventId: event3.id,
      userId: user5.id,
      messageToHost: "Hi, I'm Naoya",
      restrictionNote: "I'm allergic to peanuts",
      isAccepted: true,
      isAttended: false,
    },
  });

  // Participant for Event 3
  await prisma.eventParticipants.upsert({
    where: {
      id: user6.id,
    },
    update: {},
    create: {
      eventId: event3.id,
      userId: user6.id,
      messageToHost: "Hi, I'm Taro, I'm sorry I can't make it",
      restrictionNote: "",
      isAccepted: false,
      isAttended: false,
    },
  });

  // Participant for Event 3
  await prisma.eventParticipants.upsert({
    where: {
      id: user7.id,
    },
    update: {},
    create: {
      eventId: event3.id,
      userId: user7.id,
      messageToHost: "Hi, I'm Yuki, I'm sorry I can't make it",
      restrictionNote: "",
      isAccepted: true,
      isAttended: true,
    },
  });

  // Temp Participant for Event 3
  await prisma.eventTempParticipant.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      eventId: event3.id,
      name: "Tmp-Amane",
      isAttended: false,
    },
  });

  await prisma.eventTempParticipant.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      eventId: event3.id,
      name: "Tmp-Hibito",
      isAttended: false,
    },
  });

  await prisma.eventTempParticipant.upsert({
    where: {
      id: 3,
    },
    update: {},
    create: {
      eventId: event3.id,
      name: "Tmp-Mutta",
      isAttended: true,
    },
  });

  // Timelines for Event 3
  await prisma.timelines.upsert({
    where: {
      id: 4,
    },
    update: {},
    create: {
      eventId: event3.id,
      title: "Arrival",
      description:
        "Feel free to arrive anytime between 4:00 and 4:30. Light snacks and drinks will be available as you arrive!",
      startTime: new Date("2025-04-03T12:00:00.000Z"),
      endTime: new Date("2025-04-03T12:30:00.000Z"),
    },
  });

  // Timelines for Event 3
  await prisma.timelines.upsert({
    where: {
      id: 5,
    },
    update: {},
    create: {
      eventId: event3.id,
      title: "Dinner",
      description: "Dinner will be served at 5:00 PM.",
      startTime: new Date("2025-04-03T17:00:00.000Z"),
      endTime: new Date("2025-04-03T18:00:00.000Z"),
    },
  });

  // Event4 (Takoyaki party
  await prisma.events.upsert({
    where: {
      id: 4,
    },
    update: {},
    create: {
      hostId: 1,
      title: "Takoyaki party",
      thumbnailUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      startTime: new Date("2025-04-03T12:00:00.000Z"),
      endTime: new Date("2025-04-03T17:00:00.000Z"),
      address: "V6Z 1L2 Canada, BC, Vancouver, 978 Granvill St",
      latitude: 49.27952393542969,
      longitude: -123.122483396198,
      isAskRestrictions: false,
      theme: "#7fffd4",
      noteForThingsToBuy: "",
      noteForNecessities: "",
      eventParticipants: {
        create: [
          {
            userId: user4.id,
            userFamilyId: 10,
            messageToHost: "",
            restrictionNote: "",
            isAccepted: true,
            isAttended: false,
          },
          {
            userId: user4.id,
            userFamilyId: 11,
            messageToHost: "",
            restrictionNote: "",
            isAccepted: true,
            isAttended: true,
          },
        ],
      },
    },
  });
}
