import { PrismaClient } from "@prisma/client";
import { seedBen } from "./seed-ben";

const prisma = new PrismaClient();

async function main() {
  // User 1 (Alice)
  const user1 = await prisma.users.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice",
      email: "alice@example.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
      userFamilies: {
        create: [
          {
            name: "Ken",
            profileImageUrl: "",
            isDeleted: false,
          },
          {
            name: "Laura",
            profileImageUrl:
              "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
            isDeleted: false,
          },
        ],
      },
    },
  });

  console.log(`Upserted user: ${user1.name}`);

  // User 2 (Taro)
  const user2 = await prisma.users.upsert({
    where: { email: "taro@example.com" },
    update: {},
    create: {
      name: "Taro",
      email: "taro@example.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
    },
  });

  console.log(`Upserted user: ${user2.name}`);

  // User 3 (Jane)
  const user3 = await prisma.users.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      name: "Jane",
      email: "jane@example.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
      userFamilies: {
        create: {
          name: "Emma",
          profileImageUrl:
            "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
          isDeleted: false,
        },
      },
    },
  });

  console.log(`Upserted user: ${user3.id}`);

  // Event 1
  const event1 = await prisma.events.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      hostId: user3.id,
      title: "Test party",
      thumbnailUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      startTime: new Date("2025-04-01T10:00:00.000Z"),
      endTime: new Date("2025-04-01T16:00:00.000Z"),
      address: "V6Z 1L2 Canada, BC, Vancouver, 978 Granvill St",
      latitude: 49.27952393542969,
      longitude: -123.122483396198,
      isAskRestrictions: false,
      theme: "#7fffd4",
      noteForThingsToBuy: "",
      noteForNecessities: "",
    },
  });

  // Timelines for Event 1
  await prisma.timelines.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      eventId: event1.id,
      title: "Arrival",
      description:
        "Feel free to arrive anytime between 4:00 and 4:30. Light snacks and drinks will be available as you arrive!",
      startTime: new Date("2025-04-01T15:00:00.000Z"),
      endTime: new Date("2025-04-01T15:30:00.000Z"),
    },
  });

  await prisma.timelines.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      eventId: event1.id,
      title: "Dinner",
      description: "Dinner will be served at 5:00 PM",
      startTime: new Date("2025-04-01T17:00:00.000Z"),
      endTime: new Date("2025-04-01T18:00:00.000Z"),
    },
  });

  // Event 2
  await prisma.events.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      hostId: user3.id,
      title: "Emma's 6th birthday party",
      thumbnailUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      startTime: new Date("2025-04-02T12:00:00.000Z"),
      endTime: new Date("2025-04-02T17:00:00.000Z"),
      address: "V6Z 1L2 Canada, BC, Vancouver, 978 Granvill St",
      latitude: 49.27952393542969,
      longitude: -123.122483396198,
      isAskRestrictions: true,
      theme: "#4169e1",
      noteForThingsToBuy: "Canadian Tire or Walmart",
      noteForNecessities: "Don't forget to bring",
      necessities: {
        create: [
          {
            item: "food",
          },
          {
            item: "dessert",
          },
        ],
      },
    },
  });

  // ben's party
  await seedBen();
}

main()
  .catch((e) => {
    console.error(e);
    globalThis.process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
