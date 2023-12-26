import { Request, Response } from 'express'

export const notFoundHandler = (req: Request, res: Response) => {
    const message = 'Not Found'
    return res.status(404).json({ message })
}
