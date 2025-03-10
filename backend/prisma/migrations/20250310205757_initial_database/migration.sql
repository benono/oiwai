/*
  Warnings:

  - You are about to drop the column `image_public_url` on the `pictures` table. All the data in the column will be lost.
  - Added the required column `image_public_id` to the `pictures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pictures" DROP COLUMN "image_public_url",
ADD COLUMN     "image_public_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "image_url1" TEXT NOT NULL,
    "image_url2" TEXT NOT NULL,
    "image_url3" TEXT NOT NULL,
    "image_url4" TEXT NOT NULL,
    "image_public_id1" TEXT NOT NULL,
    "image_public_id2" TEXT NOT NULL,
    "image_public_id3" TEXT NOT NULL,
    "image_public_id4" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
