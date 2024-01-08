type ScoringSystem = {
    winPoints: number
    drawPoints: number
    lossPoints: number
}

export type TournamentData = {
    tournamentName: string
    tournamentDesc: string
    competitorsNames: string[]
    scoringSystem: ScoringSystem
}
