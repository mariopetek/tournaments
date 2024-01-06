import { CreateTournamentData } from '../schemas/tournaments.schema'
import prisma from '../utils/prisma-client'
import { ForbiddenError } from '../utils/forbidden-error'
import roundsForCompetitors from '../utils/rounds-for-competitors'

export async function getTournaments(userId: string) {
    const tournaments = await prisma.tournament.findMany({
        select: {
            tournamentId: true,
            tournamentName: true,
            tournamentDesc: true,
            createdAt: true,
            userId: true,
            scoringSystem: true
        },
        where: {
            userId
        }
    })
    return tournaments
}

export async function createTournament(
    userId: string,
    data: CreateTournamentData['body']
) {
    const { tournamentName, tournamentDesc, scoringSystem, competitorsNames } =
        data
    const { winPoints, drawPoints, lossPoints } = scoringSystem

    const createdTournament = await prisma.$transaction(async tx => {
        const { tournamentId, competitors } = await tx.tournament.create({
            data: {
                tournamentName,
                tournamentDesc,
                userId,
                scoringSystem: {
                    create: {
                        winPoints,
                        drawPoints,
                        lossPoints
                    }
                },
                competitors: {
                    createMany: {
                        data: competitorsNames.map(competitorName => ({
                            competitorName
                        }))
                    }
                }
            },
            select: {
                tournamentId: true,
                competitors: true
            }
        })

        competitors.sort(() => Math.random() - 0.5)
        const rounds = roundsForCompetitors.get(competitors.length)!

        for (let round = 1; round <= rounds.length; round++) {
            await tx.match.createMany({
                data: rounds[round - 1].map(match => ({
                    competitorId: competitors[match[0]].competitorId,
                    opponentId: competitors[match[1]].competitorId,
                    round,
                    tournamentId
                }))
            })
        }
        return await tx.tournament.findUniqueOrThrow({
            where: {
                tournamentId
            },
            select: {
                tournamentId: true,
                tournamentName: true,
                tournamentDesc: true,
                createdAt: true,
                userId: true,
                scoringSystem: true,
                competitors: {
                    select: {
                        competitorId: true,
                        competitorName: true,
                        points: true
                    }
                },
                matches: {
                    select: {
                        competitor: true,
                        opponent: true,
                        playedAt: true,
                        result: true,
                        round: true
                    }
                }
            }
        })
    })
    return createdTournament
}

export async function getTournament(userId: string, tournamentId: string) {
    const tournament = await prisma.tournament.findUniqueOrThrow({
        where: {
            tournamentId
        },
        select: {
            tournamentId: true,
            tournamentName: true,
            tournamentDesc: true,
            createdAt: true,
            userId: true,
            scoringSystem: true,
            competitors: {
                select: {
                    competitorId: true,
                    competitorName: true,
                    points: true
                }
            },
            matches: {
                select: {
                    competitor: true,
                    opponent: true,
                    playedAt: true,
                    result: true,
                    round: true
                }
            }
        }
    })

    if (tournament.userId !== userId) {
        throw new ForbiddenError()
    }

    return tournament
}

export async function deleteTournament(userId: string, tournamentId: string) {
    const tournament = await prisma.tournament.findUniqueOrThrow({
        where: {
            tournamentId
        }
    })

    if (tournament.userId !== userId) {
        throw new ForbiddenError()
    }

    await prisma.$transaction([
        prisma.match.deleteMany({
            where: {
                tournamentId
            }
        }),
        prisma.competitor.deleteMany({
            where: {
                tournamentId
            }
        }),
        prisma.tournament.delete({
            where: {
                tournamentId
            }
        }),
        prisma.scoringSystem.delete({
            where: {
                scoringSystemId: tournament.scoringSystemId
            }
        })
    ])
}
