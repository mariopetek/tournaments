import express from 'express'

import db from '../db'

const router = express.Router()

router.get('/competitions/:competitionId', async (req, res) => {
    try {
        const competition = (
            await db.query(
                `select * from competition where competition_id = ${req.params.competitionId}`
            )
        ).rows[0]
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

        res.render('public/competition', {
            title: competition.competition_name,
            competition,
            rounds,
            winners
        })
    } catch (err) {
        res.sendStatus(400)
    }
})

router.get('/competitions/leaderboard/:competitionId', async (req, res) => {
    try {
        const competition = (
            await db.query(
                `select * from competition where competition_id = ${req.params.competitionId}`
            )
        ).rows[0]
        const competitors = (
            await db.query(
                `select * from competitor where competition_id = ${req.params.competitionId} order by points desc, competitor_name`
            )
        ).rows

        res.render('public/leaderboard', {
            title: competition.competition_name + ' | Poredak',
            user: req.oidc.user,
            competition,
            competitors
        })
    } catch (err) {
        res.sendStatus(400)
    }
})

export default router
