/*
  Warnings:

  - A unique constraint covering the columns `[competitorName,tournamentId]` on the table `Competitor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Competitor_competitorName_tournamentId_key" ON "Competitor"("competitorName", "tournamentId");
