import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.users.create({
    data: {
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

  console.log(`Created user: ${user1.name}`);

  const user2 = await prisma.users.create({
    data: {
      name: "Taro",
      email: "taro@example.com",
      profileImageUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      isDeleted: false,
    },
  });

  console.log(`Created user: ${user2.name}`);

  const user3 = await prisma.users.create({
    data: {
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
  console.log(`Created user: ${user3.id}`);

  const event1 = await prisma.events.create({
    data: {
      hostId: user3.id,
      title: "Test party",
      thumbnailUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      startTime: new Date("2025-04-01T10:00:00.000Z"),
      endTime: new Date("2025-04-01T16:00:00.000Z"),
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

  const event2 = await prisma.events.create({
    data: {
      hostId: user3.id,
      title: "Emma's 6th birthday party",
      thumbnailUrl:
        "https://res.cloudinary.com/dfv5exqy3/image/upload/v1733782881/cld-sample-4.png",
      startTime: new Date("2025-04-02T12:00:00.000Z"),
      endTime: new Date("2025-04-02T17:00:00.000Z"),
      country: "Canada",
      postalCode: "V6Z 1L2",
      province: "BC",
      city: "Vancouver",
      address1: "978 Granvill St",
      address2: "",
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
}

main()
  .catch((e) => {
    console.error(e);
    globalThis.process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
