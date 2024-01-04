import { NextFunction, Request, Response } from 'express'

const tryCatch =
    (
        requestHandler: (
            req: Request,
            res: Response,
            next: NextFunction
        ) => Promise<Response<any, Record<string, any>>>
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next)
        } catch (err) {
            return next(err)
        }
    }

export default tryCatch
