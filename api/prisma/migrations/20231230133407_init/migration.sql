-- CreateTable
CREATE TABLE "Tournament" (
    "tournamentId" UUID NOT NULL,
    "tournamentName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "scoringSystemId" UUID NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("tournamentId")
);

-- CreateTable
CREATE TABLE "ScoringSystem" (
    "scoringSystemId" UUID NOT NULL,
    "winPoints" SMALLINT NOT NULL DEFAULT 3,
    "drawPoints" SMALLINT NOT NULL DEFAULT 1,
    "lossPoints" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "ScoringSystem_pkey" PRIMARY KEY ("scoringSystemId")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "competitorId" UUID NOT NULL,
    "competitorName" VARCHAR(255) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "tournamentId" UUID NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("competitorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_scoringSystemId_key" ON "Tournament"("scoringSystemId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_scoringSystemId_fkey" FOREIGN KEY ("scoringSystemId") REFERENCES "ScoringSystem"("scoringSystemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("tournamentId") ON DELETE RESTRICT ON UPDATE CASCADE;
