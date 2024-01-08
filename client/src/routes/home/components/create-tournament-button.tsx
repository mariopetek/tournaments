import styles from './styles/create-tournament-button.module.css'

export default function CreateTournamentButton({
    isPending
}: {
    isPending: boolean
}) {
    return (
        <button
            className={styles.button}
            title="Create tournament"
            disabled={isPending}
        >
            {isPending ? 'Creating...' : 'Create'}
        </button>
    )
}
