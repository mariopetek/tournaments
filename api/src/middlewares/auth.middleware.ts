import dotenv from 'dotenv'
import { auth } from 'express-oauth2-jwt-bearer'

dotenv.config()

export const validateAccessToken = auth({
    issuerBaseURL: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    tokenSigningAlg: 'RS256'
})
