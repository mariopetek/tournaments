import { TournamentData } from '../../../types/create-tournament-types'
import styles from './styles/add-competitor-button.module.css'
import { FaUserPlus } from 'react-icons/fa'

export default function AddCompetitorButton({
    tournament,
    setTournament
}: {
    tournament: TournamentData
    setTournament: React.Dispatch<React.SetStateAction<TournamentData>>
}) {
    const handleAddCompetitorName = () => {
        setTournament({
            ...tournament,
            competitorsNames: [...tournament.competitorsNames, '']
        })
    }
    return (
        <button
            className={styles.button}
            type="button"
            title="Add competitor"
            onClick={handleAddCompetitorName}
            disabled={tournament.competitorsNames.length >= 8}
        >
            <FaUserPlus />
            <span>Add</span>
        </button>
    )
}
