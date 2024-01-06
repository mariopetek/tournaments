import { useAuth0 } from '@auth0/auth0-react'
import styles from './styles/log-out-button.module.css'
import { FaRightFromBracket } from 'react-icons/fa6'

export default function LogOutButton() {
    const { logout } = useAuth0()
    return (
        <button
            className={styles.button}
            onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
            }
        >
            <span>Log out</span>
            <FaRightFromBracket />
        </button>
    )
}
