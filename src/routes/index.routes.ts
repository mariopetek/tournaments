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
        for (const competitor of competitorsArr) {
            await db.query(
                `insert into competitor (competitor_name, competition_id) values ('${competitor}', ${competitionId})`
            )
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
