import { NextFunction, Request, Response } from 'express'
import { InvalidTokenError, UnauthorizedError } from 'express-oauth2-jwt-bearer'

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof InvalidTokenError) {
        const message = 'Bad credentials'
        return res.status(err.status).json({ message })
    }

    if (err instanceof UnauthorizedError) {
        const message = 'Requires authentication'
        return res.status(err.status).json({ message })
    }

    const status = 500
    const message = 'Internal Server Error'

    return res.status(status).json({ message })
}
