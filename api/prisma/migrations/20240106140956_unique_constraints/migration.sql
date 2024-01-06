/*
  Warnings:

  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[tournament_id,competitor_id,round]` on the table `matches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournament_name,user_id]` on the table `tournaments` will be added. If there are existing duplicate values, this will fail.
  - The required column `match_id` was added to the `matches` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
ADD COLUMN     "match_id" UUID NOT NULL,
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_tournament_id_competitor_id_round_key" ON "matches"("tournament_id", "competitor_id", "round");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_tournament_name_user_id_key" ON "tournaments"("tournament_name", "user_id");
