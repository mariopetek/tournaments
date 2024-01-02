import express from 'express'
import {
    createTournamentHandler,
    deleteTournamentHandler,
    getLeaderboardHandler,
    getTournamentHandler,
    getTournamentsHandler,
    updateTournamentHandler
} from '../controllers/tournaments.controller'

const router = express.Router()

/*
    GET /api/tournaments/:userId - Get all tournaments of a user
    POST /api/tournaments/:userId - Create a new tournament of a user
*/
router.route('/').get(getTournamentsHandler).post(createTournamentHandler)

/*
    GET /api/tournaments/:userId/:tournamentId - Get a single tournament of a user
    PUT /api/tournaments/:userId/:tournamentId - Update a single tournament of a user
    DELETE /api/tournaments/:userId/:tournamentId - Delete a single tournament of a user
*/
router
    .route('/:tournamentId')
    .get(getTournamentHandler)
    .put(updateTournamentHandler)
    .delete(deleteTournamentHandler)

/*
    GET /api/tournaments/:userId/:tournamentId/leaderboard - Get the leaderboard for a tournament of a user
*/
router.get('/:tournamentId/leaderboard', getLeaderboardHandler)

export default router
