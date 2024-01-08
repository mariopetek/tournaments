import React from 'react'
import { TournamentData } from '../../../types/create-tournament-types'
import { FaUserMinus } from 'react-icons/fa'

import styles from './styles/remove-competitor-button.module.css'

export default function RemoveCompetitorButton({
    tournament,
    setTournament,
    index
}: {
    tournament: TournamentData
    setTournament: React.Dispatch<React.SetStateAction<TournamentData>>
    index: number
}) {
    const handleRemoveCompetitorName = (index: number) => {
        const newCompetitorsNames = [...tournament.competitorsNames]
        newCompetitorsNames.splice(index, 1)
        setTournament({
            ...tournament,
            competitorsNames: newCompetitorsNames
        })
    }
    return (
        <button
            className={styles.button}
            type="button"
            title="Remove competitor"
            onClick={() => handleRemoveCompetitorName(index)}
        >
            <FaUserMinus />
        </button>
    )
}
