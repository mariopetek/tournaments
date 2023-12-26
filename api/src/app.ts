import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import tournamentsRouter from './routes/tournaments.routes'
import { errorHandler } from './middleware/error.middleware'
import { notFoundHandler } from './middleware/not-found.middleware'
import { validateAccessToken } from './middleware/auth.middleware'

dotenv.config()

const app = express()
const apiRouter = express.Router()

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN_URL,
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        maxAge: 86400
    })
)

app.use(validateAccessToken)

app.use('/api', apiRouter)
apiRouter.use('/tournaments', tournamentsRouter)

app.use(errorHandler)
app.use(notFoundHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Running locally at http://localhost:${PORT}`)
})
