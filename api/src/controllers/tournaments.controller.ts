import { NextFunction, Request, Response } from 'express'
import {
    createTournament,
    deleteTournament,
    getTournament,
    getTournaments
} from '../services/tournaments.service'
import type {
    CreateTournamentData,
    GetTournamentData,
    DeleteTournamentData
} from '../schemas/tournaments.schema'

export async function getTournamentsHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = req.auth?.payload.sub!
    try {
        const tournaments = await getTournaments(userId)
        return res.json(tournaments)
    } catch (err) {
        return next(err)
    }
}

export async function createTournamentHandler(
    req: Request<{}, {}, CreateTournamentData['body']>,
    res: Response,
    next: NextFunction
) {
    const userId = req.auth?.payload.sub!
    try {
        const tournament = await createTournament(userId, req.body)
        return res.json(tournament)
    } catch (err) {
        return next(err)
    }
}

export async function getTournamentHandler(
    req: Request<GetTournamentData['params']>,
    res: Response,
    next: NextFunction
) {
    const userId = req.auth?.payload.sub!
    const tournamentId = req.params.tournamentId
    try {
        const tournament = await getTournament(userId, tournamentId)
        return res.json(tournament)
    } catch (err) {
        return next(err)
    }
}

export async function deleteTournamentHandler(
    req: Request<DeleteTournamentData['params']>,
    res: Response,
    next: NextFunction
) {
    const userId = req.auth?.payload.sub!
    const tournamentId = req.params.tournamentId
    try {
        await deleteTournament(userId, tournamentId)
        return res
            .status(200)
            .json({ message: 'Successfully deleted tournament' })
    } catch (err) {
        return next(err)
    }
}
