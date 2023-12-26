import { useAuth0 } from '@auth0/auth0-react'
import styles from './styles/sign-in-button.module.css'

export default function LogInButton() {
    const { loginWithRedirect } = useAuth0()

    return (
        <button className={styles.button} onClick={() => loginWithRedirect()}>
            Log in
        </button>
    )
}
