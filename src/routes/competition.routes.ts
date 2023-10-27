import express from 'express'
import { requiresAuth } from 'express-openid-connect'

import db from '../db'

const router = express.Router()

const responseObj = {
    name: 'competitions',
    title: 'Natjecanja'
}

router.get('/', requiresAuth(), async (req, res) => {
    let competitions
    try {
        competitions = (
            await db.query(
                `select * from competition where user_id = '${req.oidc.user?.sub}'`
            )
        ).rows
        console.log(competitions)
    } catch (err) {
        console.log(err)
    }
    res.render('competitions', {
        ...responseObj,
        user: req.oidc.user,
        competitions
    })
})

router
    .route('/:competitionId')
    .get(requiresAuth(), async (req, res) => {
        res.render('competition', {
            ...responseObj,
            user: req.oidc.user,
            id: req.params.competitionId
        })
    })
    .post(requiresAuth(), async (req, res) => {})

export default router
