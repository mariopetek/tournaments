import { Prisma } from '@prisma/client'
import { CreateTournamentData } from '../schemas/tournaments.schema'
import prisma from '../utils/prisma-client'
import { ForbiddenError } from '../utils/forbidden-error'

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
    const { tournamentName, tournamentDesc, scoringSystem, competitors } = data
    const { winPoints, drawPoints, lossPoints } = scoringSystem

    const tournamentData: Prisma.TournamentCreateInput = {
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
                data: competitors.map(competitorName => ({
                    competitorName
                }))
            }
        }
    }

    // TO DO...

    const tournament = await prisma.tournament.create({
        data: tournamentData,
        select: {
            tournamentId: true,
            tournamentName: true,
            tournamentDesc: true,
            createdAt: true,
            userId: true,
            scoringSystem: true
        }
    })
    return tournament
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
