/*
  Warnings:

  - Added the required column `budget` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `things_to_buy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `things_to_buy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "budget" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "things_to_buy" ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
