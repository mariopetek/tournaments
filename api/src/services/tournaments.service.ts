import { CreateTournamentData } from '../schemas/tournaments.schema'
import prisma from '../utils/prisma-client'

export async function getTournaments(userId: string) {
    const tournaments = await prisma.tournament.findMany({
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
            }
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
    const tournament = await prisma.tournament.create({
        data: {
            tournamentName: data.tournamentName,
            tournamentDesc: data.tournamentDesc,
            userId: userId!,
            scoringSystem: {
                create: {
                    winPoints: data.scoringSystem.winPoints,
                    lossPoints: data.scoringSystem.lossPoints,
                    drawPoints: data.scoringSystem.drawPoints
                }
            },
            competitors: {
                createMany: {
                    data: data.competitors.map(competitor => {
                        return {
                            competitorName: competitor
                        }
                    })
                }
            }
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
            }
        }
    })
    return tournament
}

export async function getTournament(
    userId: string | undefined,
    tournamentId: string
) {}

export async function updateTournament(
    userId: string | undefined,
    tournamentId: string
) {}

export async function deleteTournament(
    userId: string | undefined,
    tournamentId: string
) {}

export async function getLeaderboard(
    userId: string | undefined,
    tournamentId: string
) {}
