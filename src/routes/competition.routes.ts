import express from 'express'
import { requiresAuth } from 'express-openid-connect'

import db from '../db'

const router = express.Router()

const responseObj = {
    name: 'competitions',
    title: 'Natjecanja'
}

router.get('/', requiresAuth(), async (req, res) => {
    try {
        const competitions = (
            await db.query(
                `select * from competition where user_id = '${req.oidc.user?.sub}' order by created_at desc`
            )
        ).rows
        console.log(competitions)

        res.render('competitions', {
            ...responseObj,
            user: req.oidc.user,
            competitions
        })
    } catch (err) {
        console.log(err)
        return
    }
})

router
    .route('/:competitionId')
    .get(requiresAuth(), async (req, res) => {
        const competition = (
            await db.query(
                `select * from competition where competition_id = ${req.params.competitionId}`
            )
        ).rows[0]
        if (competition.user_id !== req.oidc.user?.sub) {
            res.sendStatus(403)
            return
        }
        const competitors = (
            await db.query(
                `select * from competitor where competition_id = ${req.params.competitionId} order by points, competitor_name`
            )
        ).rows

        res.render('competition', {
            ...responseObj,
            user: req.oidc.user,
            competitionName: competition.competition_name,
            competitors
        })
    })
    .post(requiresAuth(), async (req, res) => {})

router.post(
    '/delete/:competitionId',
    (requiresAuth(),
    async (req, res) => {
        try {
            await db.query(
                `delete from competition_round where competitor_id_1 = any(select competitor_id from competitor where competition_id = ${req.params.competitionId});`
            )
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
    try {
        const competition = (
            await db.query(
                `select * from competition where competition_id = ${req.params.competitionId}`
            )
        ).rows[0]
        if (competition.user_id !== req.oidc.user?.sub) {
            res.sendStatus(403)
            return
        }
        const competitors = (
            await db.query(
                `select * from competitor where competition_id = ${req.params.competitionId} order by points, competitor_name`
            )
        ).rows

        res.render('result', {
            ...responseObj,
            user: req.oidc.user,
            competitionName: competition.competition_name,
            competitors
        })
    } catch (err) {
        console.log(err)
    }
})

export default router
