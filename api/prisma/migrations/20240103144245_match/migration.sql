/*
  Warnings:

  - You are about to alter the column `competitorName` on the `Competitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `points` on the `Competitor` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `tournamentName` on the `Tournament` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - Added the required column `tournamentDesc` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Result" AS ENUM ('W', 'D', 'L');

-- AlterTable
ALTER TABLE "Competitor" ALTER COLUMN "competitorName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "points" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "tournamentDesc" VARCHAR(200) NOT NULL,
ALTER COLUMN "tournamentName" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "Match" (
    "competitorId" UUID NOT NULL,
    "opponentId" UUID NOT NULL,
    "playedAt" TIMESTAMPTZ(6),
    "result" "Result" NOT NULL,
    "round" SMALLINT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("competitorId","opponentId")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("competitorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Competitor"("competitorId") ON DELETE RESTRICT ON UPDATE CASCADE;
