/*
  Warnings:

  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `match_id` on the `matches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
DROP COLUMN "match_id",
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("tournament_id", "competitor_id", "round");
