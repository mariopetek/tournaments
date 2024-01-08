import { useAuth0 } from '@auth0/auth0-react'
import Welcome from './components/welcome'
import CreateTournamentForm from './components/create-tournament-form'
import styles from './styles/home.module.css'

export default function Home() {
    const { isAuthenticated } = useAuth0()
    return (
        <div className={styles.homeContainer}>
            {isAuthenticated ? <CreateTournamentForm /> : <Welcome />}
        </div>
    )
}
