import express from 'express'
import { requiresAuth } from 'express-openid-connect'

import db from '../database/db'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {
        name: 'index',
        title: 'Početna',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})

router.post('/', requiresAuth(), async (req, res) => {
    const competition = { ...req.body }
    console.log(competition)
    await db.query(
        `insert into competition (competition_name, scoring_system, user_id) values ('${competition.competitionName}', '${competition.win}/${competition.draw}/${competition.loss}', '${req.oidc.user?.sub}')`
    )
    res.send(`Success`)
})

export default router
