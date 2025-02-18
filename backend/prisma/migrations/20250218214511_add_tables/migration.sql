/*
  Warnings:

  - Added the required column `address1` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address2` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_type` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAskRestriction` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note_for_shopping` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note_for_things_to_bring` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `events` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `user_id` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "address1" TEXT NOT NULL,
ADD COLUMN     "address2" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "event_type" TEXT NOT NULL,
ADD COLUMN     "isAskRestriction" BOOLEAN NOT NULL,
ADD COLUMN     "note_for_shopping" TEXT NOT NULL,
ADD COLUMN     "note_for_things_to_bring" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "events_particpants" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_accepted" BOOLEAN NOT NULL,
    "is_attended" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "participants_restrictions" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "participants_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "things_to_bring" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "is_added" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "things_to_buy" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "is_purchase" BOOLEAN NOT NULL,

    CONSTRAINT "things_to_buy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "schedule_item" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "image_title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_particpants_event_id_user_id_key" ON "events_particpants"("event_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "things_to_bring_event_id_user_id_order_key" ON "things_to_bring"("event_id", "user_id", "order");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_particpants" ADD CONSTRAINT "events_particpants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_particpants" ADD CONSTRAINT "events_particpants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants_restrictions" ADD CONSTRAINT "participants_restrictions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants_restrictions" ADD CONSTRAINT "participants_restrictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "things_to_bring" ADD CONSTRAINT "things_to_bring_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "things_to_bring" ADD CONSTRAINT "things_to_bring_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "things_to_buy" ADD CONSTRAINT "things_to_buy_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
