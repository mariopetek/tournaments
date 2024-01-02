import prisma from '../utils/prisma-client'

export async function getTournaments(userId: string | undefined) {
    const tournaments = await prisma.tournament.findMany({
        where: {
            userId
        },
        include: {
            scoringSystem: true
        }
    })
    return tournaments
}

export async function createTournament(userId: string | undefined) {}

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
