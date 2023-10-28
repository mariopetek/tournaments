import express from 'express'
import { requiresAuth } from 'express-openid-connect'

import db from '../db'

const router = express.Router()

const responseObj = {
    name: 'competitions'
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
            title: 'Natjecanja',
            user: req.oidc.user,
            competitions
        })
    } catch (err) {
        res.sendStatus(400)
    }
})

router.get('/:competitionId', requiresAuth(), async (req, res) => {
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

        const rounds = new Map()
        const winners = new Map()
        const roundsDB = (
            await db.query(
                `select * from competition_round where competitor_id_1 = any(select competitor_id from competitor where competition_id = ${req.params.competitionId}) order by round, competitor_id_1`
            )
        ).rows

        for (const round of roundsDB) {
            const competitor1 = competitors.filter(
                comp => comp.competitor_id === round.competitor_id_1
            )[0]
            const competitor2 = competitors.filter(
                comp => comp.competitor_id === round.competitor_id_2
            )[0]

            rounds.set(
                round.round,
                rounds.get(round.round) === undefined
                    ? [[competitor1, competitor2]]
                    : [...rounds.get(round.round), [competitor1, competitor2]]
            )
            winners.set(
                round.round,
                winners.get(round.round) === undefined
                    ? [round.winner]
                    : [...winners.get(round.round), round.winner]
            )
        }

        res.render('competition', {
            ...responseObj,
            title: competition.competition_name,
            user: req.oidc.user,
            competition,
            rounds,
            winners
        })
    } catch (err) {
        res.sendStatus(400)
    }
})

router.get('/leaderboard/:competitionId', requiresAuth(), async (req, res) => {
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
                `select * from competitor where competition_id = ${req.params.competitionId} order by points desc, competitor_name`
            )
        ).rows

        res.render('leaderboard', {
            ...responseObj,
            title: competition.competition_name + ' | Poredak',
            user: req.oidc.user,
            competition,
            competitors
        })
    } catch (err) {
        res.sendStatus(400)
    }
})

router.post('/delete/:competitionId', requiresAuth(), async (req, res) => {
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
        await db.query(
            `delete from competition_round where competitor_id_1 = any(select competitor_id from competitor where competition_id = ${req.params.competitionId})`
        )
        await db.query(
            `delete from competitor where competition_id = ${req.params.competitionId}`
        )
        await db.query(
            `delete from competition where competition_id = ${req.params.competitionId}`
        )

        res.redirect('/competitions')
    } catch (err) {
        res.sendStatus(400)
    }
})

router.post('/:competitionId/:opponents', requiresAuth(), async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.redirect(`/competitions/${req.params.competitionId}`)
        return
    }
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
        const winPoints = Number(competition.scoring_system.split('/')[0])
        const drawPoints = Number(competition.scoring_system.split('/')[1])
        const lossPoints = Number(competition.scoring_system.split('/')[2])
        const competitor1Id = Number(req.params.opponents.split('_')[0])
        const competitor2Id = Number(req.params.opponents.split('_')[1])
        const winnerId = Number(req.body[req.params.opponents])

        if (winnerId == -1) {
            let competitor1Points: number = (
                await db.query(
                    `select points from competitor where competitor_id = ${competitor1Id}`
                )
            ).rows[0].points
            let competitor2Points: number = (
                await db.query(
                    `select points from competitor where competitor_id = ${competitor2Id}`
                )
            ).rows[0].points
            competitor1Points += drawPoints
            competitor2Points += drawPoints
            await db.query(
                `update competitor set points = ${competitor1Points} where competitor_id = ${competitor1Id}`
            )
            await db.query(
                `update competitor set points = ${competitor2Points} where competitor_id = ${competitor2Id}`
            )
        } else {
            const loserId =
                winnerId == competitor1Id ? competitor2Id : competitor1Id
            let winnerPoints: number = (
                await db.query(
                    `select points from competitor where competitor_id = ${winnerId}`
                )
            ).rows[0].points
            let loserPoints: number = (
                await db.query(
                    `select points from competitor where competitor_id = ${loserId}`
                )
            ).rows[0].points
            winnerPoints += winPoints
            loserPoints += lossPoints
            await db.query(
                `update competitor set points = ${winnerPoints} where competitor_id = ${winnerId}`
            )
            await db.query(
                `update competitor set points = ${loserPoints} where competitor_id = ${loserId}`
            )
        }
        await db.query(
            `update competition_round set winner = ${winnerId} where competitor_id_1 = ${competitor1Id} and competitor_id_2 = ${competitor2Id}`
        )
        res.redirect(`/competitions/${req.params.competitionId}`)
    } catch (err) {
        res.sendStatus(400)
    }
})

export default router
