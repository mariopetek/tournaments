/*
  Warnings:

  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `match_id` was added to the `matches` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_opponent_id_fkey";

-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
ADD COLUMN     "match_id" UUID NOT NULL,
ALTER COLUMN "opponent_id" DROP NOT NULL,
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "competitors"("competitor_id") ON DELETE SET NULL ON UPDATE CASCADE;
