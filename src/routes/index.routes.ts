import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Natjecanja | Početna',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})

export default router
