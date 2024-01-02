import { Request, Response } from 'express'
import {
    createTournament,
    deleteTournament,
    getLeaderboard,
    getTournament,
    getTournaments,
    updateTournament
} from '../services/tournaments.service'
import type {
    CreateTournamentRequest,
    GetTournamentRequest,
    UpdateTournamentRequest,
    DeleteTournamentRequest,
    GetTournamentLeaderboardRequest
} from '../schemas/tournaments.schema'

export async function getTournamentsHandler(req: Request, res: Response) {
    const userId = req.auth?.payload.sub
    const tournaments = await getTournaments(userId)
    return res.json(tournaments)
}

export async function createTournamentHandler(
    req: Request<{}, {}, CreateTournamentRequest['body']>,
    res: Response
) {
    const userId = req.auth?.payload.sub
    const tournament = await createTournament(userId)
    return res.json(tournament)
}

export async function getTournamentHandler(
    req: Request<GetTournamentRequest['params']>,
    res: Response
) {
    const userId = req.auth?.payload.sub
    const tournamentId = req.params.tournamentId
    const tournament = await getTournament(userId, tournamentId)
    return res.json(tournament)
}

export async function updateTournamentHandler(
    req: Request<
        UpdateTournamentRequest['params'],
        {},
        UpdateTournamentRequest['body']
    >,
    res: Response
) {
    const userId = req.auth?.payload.sub
    const tournamentId = req.params.tournamentId
    const tournament = await updateTournament(userId, tournamentId)
    return res.json(tournament)
}

export async function deleteTournamentHandler(
    req: Request<DeleteTournamentRequest['params']>,
    res: Response
) {
    const userId = req.auth?.payload.sub
    const tournamentId = req.params.tournamentId
    await deleteTournament(userId, tournamentId)
    return res.json({})
}

export async function getLeaderboardHandler(
    req: Request<GetTournamentLeaderboardRequest['params']>,
    res: Response
) {
    const userId = req.auth?.payload.sub
    const tournamentId = req.params.tournamentId
    const leaderboard = await getLeaderboard(userId, tournamentId)
    return res.json(leaderboard)
}
