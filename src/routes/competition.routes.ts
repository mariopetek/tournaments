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
                `select * from competition where user_id = '${req.oidc.user?.sub}' order by created_at desc`
            )
        ).rows
        console.log(competitions)
    } catch (err) {
        console.log(err)
        return
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

router.post(
    '/delete/:competitionId',
    (requiresAuth(),
    async (req, res) => {
        try {
            await db.query(
                `delete from competitor where competition_id = ${req.params.competitionId}`
            )
            await db.query(
                `delete from competition where competition_id = ${req.params.competitionId}`
            )
        } catch (err) {
            console.log(err)
            return
        }

        res.redirect('/competitions')
    })
)

router.get('/result/:competitionId', requiresAuth(), async (req, res) => {
    res.render('result', {
        ...responseObj,
        user: req.oidc.user,
        id: req.params.competitionId
    })
})

export default router