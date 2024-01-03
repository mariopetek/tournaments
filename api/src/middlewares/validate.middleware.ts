import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const validate =
    (schema: z.AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            })
            next()
        } catch (error) {
            return next(error)
        }
    }

export default validate
