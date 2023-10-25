import express from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { auth } from 'express-openid-connect'
import dotenv from 'dotenv'

import indexRouter from './routes/index.routes'
import competitionRouter from './routes/competition.routes'
import resultRouter from './routes/result.routes'

import initDatabase from './database/init'

dotenv.config()

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

const port = 3000

const config = {
    authRequired: false,
    idpLogout: true,
    secret: process.env.SECRET,
    baseURL: `https://localhost:${port}`,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://mariopetek-web2-lab1.eu.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code'
    }
}

// auth router attaches /login, /logout, and /callback routes to the baseURL.
app.use(auth(config))

/*
app.get('/sign-up', (req, res) => {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {
            screen_hint: 'signup'
        }
    })
})*/

app.use('/', indexRouter)
app.use('/competitions', competitionRouter)
app.use('/results', resultRouter)

initDatabase()

https
    .createServer(
        {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        },
        app
    )
    .listen(port, () => {
        console.log(`Application running at https://localhost:${port}/`)
    })
