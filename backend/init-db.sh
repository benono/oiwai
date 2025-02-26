#!/bin/bash

echo "Do you want to reset the database? (y/n)"
read answer

if [ "$answer" = "y" ]; then
    echo "Resetting the database..."
    npx prisma migrate reset --force

    echo "Running migrations..."
    npx prisma migrate dev

    echo "Generating Prisma Client..."
    npx prisma generate

    echo "Do you want to seed the data? (y/n)"
    read seed_answer

    if [ "$seed_answer" = "y" ]; then
        echo "Seeding the data..."
        npx ts-node prisma/seed.ts
    fi

    echo "Done!"
else
    echo "Process aborted"
fi
