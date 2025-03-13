/*
  Warnings:

  - You are about to drop the column `address1` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `events` table. All the data in the column will be lost.
  - Added the required column `address` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "address1",
DROP COLUMN "address2",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postal_code",
DROP COLUMN "province",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
