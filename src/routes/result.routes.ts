import express from 'express'
import { requiresAuth } from 'express-openid-connect'

import db from '../database/db'

const router = express.Router()

router.get('/', requiresAuth(), (req, res) => {
    res.render('results', {
        name: 'results',
        title: 'Rezultati',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})

export default router
