import { z } from 'zod'

const body = z.object({
    name: z
        .string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be a string'
        })
        .min(1, {
            message: 'Title must be at least 1 character long'
        })
        .max(50, {
            message: 'Title must be at most 50 characters long'
        }),
    description: z
        .string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string'
        })
        .min(1, {
            message: 'Description must be at least 1 character long'
        })
        .max(200, {
            message: 'Description must be at most 200 characters long'
        }),
    competitors: z
        .array(
            z
                .string({
                    invalid_type_error: 'Competitor name must be a string'
                })
                .min(1, {
                    message: 'Competitor name must be at least 1 character long'
                })
                .max(50, {
                    message:
                        'Competitor name must be at most 50 characters long'
                }),
            {
                required_error: 'Competitors are required',
                invalid_type_error: 'Competitors must be an array'
            }
        )
        .min(4, {
            message: 'At least 4 competitors are required'
        })
        .max(8, {
            message: 'At most 8 competitors are allowed'
        }),
    scoringSystem: z.object(
        {
            winPoints: z
                .number({
                    required_error: 'Win points are required',
                    invalid_type_error: 'Win points must be a number'
                })
                .min(-10, {
                    message: 'Win points must be at least -10'
                })
                .max(10, {
                    message: 'Win points must be at most 10'
                }),
            drawPoints: z
                .number({
                    required_error: 'Draw points are required',
                    invalid_type_error: 'Draw points must be a number'
                })
                .min(-10, {
                    message: 'Draw points must be at least -10'
                })
                .max(10, {
                    message: 'Draw points must be at most 10'
                }),
            lossPoints: z
                .number({
                    required_error: 'Loss points are required',
                    invalid_type_error: 'Loss points must be a number'
                })
                .min(-10, {
                    message: 'Loss points must be at least -10'
                })
                .max(10, {
                    message: 'Loss points must be at most 10'
                })
        },
        {
            required_error: 'Scoring system is required',
            invalid_type_error: 'Scoring system must be an object'
        }
    )
})

const params = z.object({
    tournamentId: z
        .string({
            required_error: 'Tournament ID is required',
            invalid_type_error: 'Tournament ID must be a string'
        })
        .uuid({ message: 'Tournament ID must be a valid UUID' })
})

export const createTournamentSchema = z.object({
    body
})
export const getTournamentSchema = z.object({
    params
})
export const updateTournamentSchema = z.object({
    body,
    params
})
export const deleteTournamentSchema = z.object({
    params
})
export const getTournamentLeaderboardSchema = z.object({ params })

export type CreateTournamentRequest = z.TypeOf<typeof createTournamentSchema>
export type GetTournamentRequest = z.TypeOf<typeof getTournamentSchema>
export type UpdateTournamentRequest = z.TypeOf<typeof updateTournamentSchema>
export type DeleteTournamentRequest = z.TypeOf<typeof deleteTournamentSchema>
export type GetTournamentLeaderboardRequest = z.TypeOf<
    typeof getTournamentLeaderboardSchema
>
