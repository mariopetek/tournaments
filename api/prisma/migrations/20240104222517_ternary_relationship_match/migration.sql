/*
  Warnings:

  - You are about to drop the `Competitor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScoringSystem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tournament` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Competitor" DROP CONSTRAINT "Competitor_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_competitorId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_opponentId_fkey";

-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_scoringSystemId_fkey";

-- DropTable
DROP TABLE "Competitor";

-- DropTable
DROP TABLE "Match";

-- DropTable
DROP TABLE "ScoringSystem";

-- DropTable
DROP TABLE "Tournament";

-- CreateTable
CREATE TABLE "tournaments" (
    "tournament_id" UUID NOT NULL,
    "tournament_name" VARCHAR(50) NOT NULL,
    "tournament_desc" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "scoring_system_id" UUID NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("tournament_id")
);

-- CreateTable
CREATE TABLE "scoring_systems" (
    "scoring_system_id" UUID NOT NULL,
    "win_points" SMALLINT NOT NULL DEFAULT 3,
    "draw_points" SMALLINT NOT NULL DEFAULT 1,
    "loss_points" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "scoring_systems_pkey" PRIMARY KEY ("scoring_system_id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "competitor_id" UUID NOT NULL,
    "competitor_name" VARCHAR(50) NOT NULL,
    "points" SMALLINT NOT NULL DEFAULT 0,
    "tournament_id" UUID NOT NULL,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("competitor_id")
);

-- CreateTable
CREATE TABLE "matches" (
    "tournament_id" UUID NOT NULL,
    "competitor_id" UUID NOT NULL,
    "opponent_id" UUID NOT NULL,
    "played_at" TIMESTAMPTZ(6),
    "result" "Result",
    "round" SMALLINT NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("competitor_id","opponent_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_scoring_system_id_key" ON "tournaments"("scoring_system_id");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_competitor_name_tournament_id_key" ON "competitors"("competitor_name", "tournament_id");

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_scoring_system_id_fkey" FOREIGN KEY ("scoring_system_id") REFERENCES "scoring_systems"("scoring_system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("tournament_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("tournament_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("competitor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "competitors"("competitor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
