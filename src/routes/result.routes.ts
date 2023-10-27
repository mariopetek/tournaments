import express from 'express'
import { requiresAuth } from 'express-openid-connect'

import db from '../db'

const router = express.Router()

router.get('/', requiresAuth(), async (req, res) => {
    res.render('results', {
        name: 'results',
        title: 'Rezultati',
        user: req.oidc.user
    })
})

router.get('/:competitionId', requiresAuth(), async (req, res) => {})

export default router
