import express from 'express'

const router = express.Router()

/*
    GET /api/tournaments/:userId - Get all tournaments of a user
    POST /api/tournaments/:userId - Create a new tournament of a user
*/
router
    .route('/:userId')
    .get((req, res) => {
        return res.json({})
    })
    .post((req, res) => {
        return res.json({})
    })

/*
    GET /api/tournaments/:userId/:tournamentId - Get a single tournament of a user
*/
router.get('/:userId/:tournamentId', (req, res) => {
    return res.json({})
})

/*
    GET /api/tournaments/:userId/:tournamentId/leaderboard - Get the leaderboard for a tournament of a user
*/
router.get('/:userId/:tournamentId/leaderboard', (req, res) => {
    return res.json({})
})

export default router
