import express from 'express'
import { requiresAuth } from 'express-openid-connect'

const router = express.Router()

router.post('/', requiresAuth(), (req, res) => {})

router.get('/new', requiresAuth(), (req, res) => {
    res.send('Page for new competition')
})

router.get('/:competitionId', requiresAuth(), (req, res) => {
    res.send(req.params.competitionId)
})

router.get('/:competitionId/results', requiresAuth(), (req, res) => {
    res.send(`Rezultati za ${req.params.competitionId}`)
})

export default router
