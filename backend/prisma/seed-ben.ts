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
      country: "Canada",
      postalCode: "V6Z 1L2",
      province: "BC",
      city: "Vancouver",
      address1: "978 Granvill St",
      address2: "",
      isAskRestrictions: false,
      theme: "#7fffd4",
      noteForThingsToBuy: "",
      noteForNecessities: "",
    },
  });

  // Participant for Event 3
  await prisma.eventParticipants.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      eventId: event3.id,
      userId: user4.id,
      messageToHost: "",
      restrictionNote: "",
      isAccepted: true,
      isAttended: false,
    },
  });

  // Participant for Event 3
  await prisma.eventParticipants.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      eventId: event3.id,
      userId: user5.id,
      messageToHost: "",
      restrictionNote: "",
      isAccepted: true,
      isAttended: false,
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
}
