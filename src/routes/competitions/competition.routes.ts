import express from 'express'
import { requiresAuth } from 'express-openid-connect'

import db from '../../database/db'

const router = express.Router()

router.post('/', requiresAuth(), (req, res) => {})

router.get('/new', requiresAuth(), (req, res) => {
    res.render('competitions/newCompetition', {
        title: 'Natjecanja | Novo',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})

router.get('/current', requiresAuth(), (req, res) => {
    res.render('competitions/currentCompetition', {
        title: 'Natjecanja | Trenutno',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})

router.get('/current/results', requiresAuth(), (req, res) => {
    res.render('competitions/currentCompetitionResults', {
        title: 'Natjecanja | Rezultati',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})

export default router
