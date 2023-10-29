import express from 'express'
import { requiresAuth } from 'express-openid-connect'
import moment from 'moment'

import db from '../db'

const router = express.Router()

const responseObj = {
    name: 'index',
    title: 'Početna',
    data: undefined,
    error: undefined,
    success: undefined
}

router.get('/', (req, res) => {
    res.render('index', {
        ...responseObj,
        user: req.oidc.user
    })
})

router.post('/', requiresAuth(), async (req, res) => {
    const { competitionName, competitors, win, draw, loss } = req.body

    let competitorsArr: string[] = competitors.split(';')
    if (competitorsArr.length == 1) {
        competitorsArr = competitors.split('\n')
    }
    competitorsArr = competitorsArr.map(c => c.trim())
    if (!isValid(competitionName, competitorsArr)) {
        res.render('index', {
            ...responseObj,
            user: req.oidc.user,
            data: req.body,
            error: 'Uneseni podaci ne zadovoljavaju traženu strukturu. Pokušajte ponovno.'
        })
        return
    }

    try {
        const competitionId = (
            await db.query(
                `insert into competition (competition_name, scoring_system, user_id, created_at) values ('${competitionName}','${win}/${draw}/${loss}', '${
                    req.oidc.user?.sub
                }', '${moment().format()}') returning *`
            )
        )?.rows[0].competition_id
        let competitorsDb = []
        for (const competitor of competitorsArr) {
            competitorsDb.push(
                (
                    await db.query(
                        `insert into competitor (competitor_name, competition_id) values ('${competitor}', ${competitionId}) returning *`
                    )
                ).rows[0]
            )
        }

        const rounds = new Map()
        rounds.set(4, {
            1: ['1vs2', '3vs4'],
            2: ['1vs3', '2vs4'],
            3: ['1vs4', '2vs3']
        })
        rounds.set(6, {
            1: ['1vs2', '3vs4', '5vs6'],
            2: ['1vs3', '2vs5', '4vs6'],
            3: ['1vs4', '2vs6', '3vs5'],
            4: ['1vs5', '2vs4', '3vs6'],
            5: ['1vs6', '2vs3', '4vs5']
        })
        rounds.set(8, {
            1: ['1vs2', '3vs4', '5vs6', '7vs8'],
            2: ['1vs3', '2vs4', '5vs7', '6vs8'],
            3: ['1vs4', '2vs3', '5vs8', '6vs7'],
            4: ['1vs5', '2vs6', '3vs7', '4vs8'],
            5: ['1vs6', '2vs5', '3vs8', '4vs7'],
            6: ['1vs7', '2vs8', '3vs5', '4vs6'],
            7: ['1vs8', '2vs7', '3vs6', '4vs5']
        })
        const competitorsNum: number = competitorsArr.length
        for (let i = 0; i < competitorsNum - 1; i++) {
            let roundArr = rounds.get(competitorsNum)[i + 1]
            for (let j = 0; j < roundArr.length; j++) {
                const competitor1 =
                    competitorsDb[Number(roundArr[j].split('vs')[0]) - 1]
                const competitor2 =
                    competitorsDb[Number(roundArr[j].split('vs')[1]) - 1]
                await db.query(`insert into competition_round (competitor_id_1, competitor_id_2, winner, round) values 
            (${competitor1.competitor_id}, ${
                    competitor2.competitor_id
                }, null, ${i + 1})`)
            }
        }
    } catch (err) {
        res.render('index', {
            ...responseObj,
            user: req.oidc.user,
            data: req.body,
            error: 'Neuspješno stvaranje natjecanja. Pokušajte ponovno.'
        })
        return
    }

    res.render('index', {
        ...responseObj,
        user: req.oidc.user,
        data: req.body,
        success: 'Natjecanje uspješno stvoreno.'
    })
})

const isValid = (
    competitionName: string,
    competitorsArr: string[]
): boolean => {
    if (competitionName.length > 255) return false
    const allowedNumOfCompetitors = [4, 6, 8]
    if (!allowedNumOfCompetitors.includes(competitorsArr.length)) return false
    for (const competitor of competitorsArr) {
        if (competitor.length > 255) return false
    }
    return true
}

export default router
