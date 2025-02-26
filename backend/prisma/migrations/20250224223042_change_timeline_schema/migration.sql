/*
  Warnings:

  - You are about to drop the column `schedule_item` on the `timelines` table. All the data in the column will be lost.
  - Added the required column `title` to the `timelines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "timelines" DROP COLUMN "schedule_item",
ADD COLUMN     "title" TEXT NOT NULL;
