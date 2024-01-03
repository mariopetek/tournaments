import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import tournamentsRouter from './routes/tournaments.route'
import { errorHandler } from './middlewares/error.middleware'
import { notFoundHandler } from './middlewares/not-found.middleware'
import { validateAccessToken } from './middlewares/auth.middleware'

dotenv.config()

const app = express()

app.use(express.json())

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        maxAge: 86400
    })
)

app.use(validateAccessToken)

app.use('/api/tournaments', tournamentsRouter)

app.use(errorHandler)
app.use(notFoundHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Running locally at http://localhost:${PORT}`)
})
