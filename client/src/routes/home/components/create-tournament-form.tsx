import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

import styles from './styles/create-tournament-form.module.css'
import CreateTournamentButton from './create-tournament-button'
import AddCompetitorButton from './add-competitor-button'
import { TournamentData } from '../../../types/create-tournament-types'
import RemoveCompetitorButton from './remove-competitor-button'

export default function CreateTournamentForm() {
    const { getAccessTokenSilently } = useAuth0()
    const [tournament, setTournament] = useState<TournamentData>({
        tournamentName: '',
        tournamentDesc: '',
        competitorsNames: ['', '', '', ''],
        scoringSystem: {
            winPoints: 0,
            drawPoints: 0,
            lossPoints: 0
        }
    })

    const createTournamentMutation = useMutation({
        mutationFn: async (tournament: TournamentData) => {
            return axios.post(
                `${import.meta.env.VITE_API_SERVER_URL}/api/tournaments`,
                tournament,
                {
                    headers: {
                        Authorization: `Bearer ${await getAccessTokenSilently()}`
                    }
                }
            )
        }
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if (name.startsWith('competitorName')) {
            const index = Number(event.target.id.replace('competitorName', ''))
            const newCompetitorsNames = [...tournament.competitorsNames]
            newCompetitorsNames[index] = value
            setTournament({
                ...tournament,
                competitorsNames: newCompetitorsNames
            })
        } else if (
            name === 'winPoints' ||
            name === 'drawPoints' ||
            name === 'lossPoints'
        ) {
            setTournament({
                ...tournament,
                scoringSystem: {
                    ...tournament.scoringSystem,
                    [name]: Number(value)
                }
            })
        } else {
            setTournament({ ...tournament, [name]: value })
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await createTournamentMutation.mutateAsync(
                tournament
            )
            console.log(response.data)
        } catch (err) {
            if (err instanceof AxiosError) {
                console.log(err.response?.data)
            }
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Create tournament</h1>
            <div className={styles.flexContainer}>
                <div className={styles.tournamentInfoContainer}>
                    <label
                        htmlFor="tournamentName"
                        className={styles.inputContainer}
                    >
                        <span>Name</span>
                        <input
                            className={styles.input}
                            type="text"
                            name="tournamentName"
                            id="tournamentName"
                            value={tournament.tournamentName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                            placeholder='e.g. "Chess tournament"'
                        />
                    </label>
                    <label
                        htmlFor="tournamentDesc"
                        className={styles.inputContainer}
                    >
                        <span>Description</span>
                        <input
                            className={styles.input}
                            type="text"
                            name="tournamentDesc"
                            id="tournamentDesc"
                            value={tournament.tournamentDesc}
                            onChange={handleInputChange}
                            required
                            maxLength={200}
                            placeholder='e.g. "A tournament for chess players"'
                        />
                    </label>
                    <div className={styles.scoringSystemContainer}>
                        <h3>Scoring system</h3>
                        <div className={styles.pointsInputContainer}>
                            <input
                                className={styles.input}
                                type="number"
                                name="winPoints"
                                id="winPoints"
                                required
                                max={10}
                                min={-10}
                                value={tournament.scoringSystem.winPoints}
                                onChange={handleInputChange}
                            />
                            <span>Win</span>
                        </div>

                        <div className={styles.pointsInputContainer}>
                            <input
                                className={styles.input}
                                type="number"
                                name="drawPoints"
                                id="drawPoints"
                                required
                                max={10}
                                min={-10}
                                value={tournament.scoringSystem.drawPoints}
                                onChange={handleInputChange}
                            />
                            <span>Draw</span>
                        </div>
                        <div className={styles.pointsInputContainer}>
                            <input
                                className={styles.input}
                                type="number"
                                name="lossPoints"
                                id="lossPoints"
                                required
                                max={10}
                                min={-10}
                                value={tournament.scoringSystem.lossPoints}
                                onChange={handleInputChange}
                            />
                            <span>Loss</span>
                        </div>
                    </div>
                    <CreateTournamentButton
                        isPending={createTournamentMutation.isPending}
                    />
                </div>
                <div className={styles.separator}></div>
                <div className={styles.competitorsContainer}>
                    <h2>Competitors</h2>
                    <AddCompetitorButton
                        tournament={tournament}
                        setTournament={setTournament}
                    />
                    {tournament.competitorsNames.map(
                        (competitorName, index) => (
                            <div
                                key={index}
                                className={styles.competitorInputContainer}
                            >
                                <input
                                    className={styles.input}
                                    type="text"
                                    name={`competitorName${index}`}
                                    id={`competitorName${index}`}
                                    value={competitorName}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={50}
                                    placeholder='e.g. "John Doe"'
                                />
                                {index > 3 && (
                                    <RemoveCompetitorButton
                                        tournament={tournament}
                                        setTournament={setTournament}
                                        index={index}
                                    />
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </form>
    )
}
