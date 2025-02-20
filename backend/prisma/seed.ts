import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.users.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      profileImageUrl: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      userFamilies: {
        create: [{
            name: 'Ken',
            profileImageUrl: 'https://images.unsplash.com/photo-1447875372440-4037e6fae95d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Laura',
          profileImageUrl: 'https://plus.unsplash.com/premium_photo-1681842331029-2e262fb2aa22?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
      ],
    }
    },
  });

  console.log(`Created user: ${user1.name}`);

  const user2 = await prisma.users.create({
    data: {
      name: 'Taro',
      email: 'taro@example.com',
      profileImageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9MbfB_G0_F9yd-42CgWpRIS-NUNDcG7b1PcEHIi1TP_9-yyEwMeVfzfyP1mX_BYftGuwIP6viAI36wiCMulvmHF9gdxuqWqJak9b496_pUEYX-SIyjD3whdCXyq1NZ3ovS9j90A4M2tfo/s400/businessman_gutspose.png',
    },
  });

  console.log(`Created user: ${user2.name}`);

  const user3 = await prisma.users.create({
    data: {
      name: 'Jane',
      email: 'jane@example.com',
      profileImageUrl: 'https://images.unsplash.com/photo-1618085222100-93f0eecad0aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      userFamilies: {
        create: {
            name: 'Emma',
            profileImageUrl: 'https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    }
    },
  });
  console.log(`Created user: ${user3.id}`);

  const event1 = await prisma.events.create({
    data: {
      userId: user3.id,
      title: 'Test party',
      thumbnailUrl: '',
      startTime: new Date("2025-04-01T10:00:00.000Z"),
      endTime: new Date("2025-04-01T16:00:00.000Z"),
      country: 'Canada',
      postalCode: 'V6Z 1L2',
      province: 'BC',
      city: 'Vancouver',
      address1: '978 Granvill St',
      address2: '',
      isAskRestrictions: false,
      eventType: 'Home party',
      designInfo: '',
      theme: '',
      noteForThingsToBuy: '',
      noteForNecessities: '',
    }
  })

  const event2 = await prisma.events.create({
    data: {
      userId: user3.id,
      title: 'Emma\'s 6th birthday party',
      thumbnailUrl: '',
      startTime: new Date("2025-04-02T12:00:00.000Z"),
      endTime: new Date("2025-04-02T17:00:00.000Z"),
      country: 'Canada',
      postalCode: 'V6Z 1L2',
      province: 'BC',
      city: 'Vancouver',
      address1: '978 Granvill St',
      address2: '',
      isAskRestrictions: true,
      eventType: 'Home party',
      designInfo: '',
      theme: '',
      noteForThingsToBuy: 'Canadian Tire or Walmart',
      noteForNecessities: 'Don\'t forget to bring',
      necessities: {
        create: [{
            userId : user3.id,
            order: 1,
            item: 'food',
            isAdded: false,
          },
          {
            userId : user3.id,
            order: 2,
            item: 'dessert',
            isAdded: false,
          }
      ],
    }
    }
  })
  
}

main()
  .catch((e) => {
    console.error(e);
    globalThis.process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
