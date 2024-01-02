import { z } from 'zod'

const body = z.object({
    title: z.string({ required_error: 'title is required' }),
    competitors: z.array(z.string(), {
        required_error: 'competitors is required'
    }),
    scoringSystem: z.object(
        {
            winPoints: z.number({ required_error: 'winPoints is required' }),
            drawPoints: z.number({ required_error: 'drawPoints is required' }),
            lossPoints: z.number({ required_error: 'lossPoints is required' })
        },
        {
            required_error: 'scoringSystem is required'
        }
    )
})

const params = z.object({
    tournamentId: z.string({ required_error: 'tournamentId is required' })
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
