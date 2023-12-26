import express from 'express'

const router = express.Router()

/*
    GET /api/tournaments/:userId - Get all tournaments of a user
    POST /api/tournaments/:userId - Create a new tournament of a user
*/
router
    .route('/')
    .get((req, res) => {
        const userId = req.auth?.payload.sub
        console.log(userId)
        return res.json({})
    })
    .post((req, res) => {
        /*
        const userId = req.auth?.payload.sub
        */
        return res.json({})
    })

/*
    GET /api/tournaments/:userId/:tournamentId - Get a single tournament of a user
*/
router.get('/:tournamentId', (req, res) => {
    /*
    const userId = req.auth?.payload.sub
    const tournamentId = req.params.tournamentId
    */
    return res.json({})
})

/*
    GET /api/tournaments/:userId/:tournamentId/leaderboard - Get the leaderboard for a tournament of a user
*/
router.get('/:tournamentId/leaderboard', (req, res) => {
    /*
    const userId = req.auth?.payload.sub
    const tournamentId = req.params.tournamentId
    */
    return res.json({})
})

export default router
