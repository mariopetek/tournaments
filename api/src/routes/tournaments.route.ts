import express from 'express'
import validateTournaments from '../middlewares/validate.middleware'
import {
    createTournamentHandler,
    deleteTournamentHandler,
    getLeaderboardHandler,
    getTournamentHandler,
    getTournamentsHandler,
    updateTournamentHandler
} from '../controllers/tournaments.controller'
import {
    createTournamentSchema,
    deleteTournamentSchema,
    getTournamentLeaderboardSchema,
    getTournamentSchema,
    updateTournamentSchema
} from '../schemas/tournaments.schema'
import tryCatch from '../utils/try-catch'

const router = express.Router()

/*
    GET /api/tournaments - Get all tournaments of a user
    POST /api/tournaments - Create a new tournament of a user
*/
router
    .route('/')
    .get(tryCatch(getTournamentsHandler))
    .post(
        validateTournaments(createTournamentSchema),
        tryCatch(createTournamentHandler)
    )

/*
    GET /api/tournaments/:tournamentId - Get a single tournament of a user
    PUT /api/tournaments/:tournamentId - Update a single tournament of a user
    DELETE /api/tournaments/:tournamentId - Delete a single tournament of a user
*/
router
    .route('/:tournamentId')
    .get(validateTournaments(getTournamentSchema), getTournamentHandler)
    .put(validateTournaments(updateTournamentSchema), updateTournamentHandler)
    .delete(
        validateTournaments(deleteTournamentSchema),
        deleteTournamentHandler
    )

/*
    GET /api/tournaments/:tournamentId/leaderboard - Get the leaderboard for a tournament of a user
*/
router.get(
    '/:tournamentId/leaderboard',
    validateTournaments(getTournamentLeaderboardSchema),
    getLeaderboardHandler
)

export default router
