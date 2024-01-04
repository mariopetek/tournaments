import { NextFunction, Request, Response } from 'express'
import { InvalidTokenError, UnauthorizedError } from 'express-oauth2-jwt-bearer'
import { ZodError } from 'zod'
import { ForbiddenError } from '../utils/forbidden-error'
import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError
} from '@prisma/client/runtime/library'

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

    if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors })
    }

    if (
        err instanceof PrismaClientKnownRequestError ||
        err instanceof PrismaClientInitializationError ||
        err instanceof PrismaClientRustPanicError ||
        err instanceof PrismaClientUnknownRequestError ||
        err instanceof PrismaClientValidationError
    ) {
        const message = 'Bad request'
        return res.status(400).json({ message })
    }

    if (err instanceof ForbiddenError) {
        return res.status(err.status).json({ message: err.message })
    }

    const status = 500
    const message = 'Internal Server Error'
    return res.status(status).json({ message })
}
