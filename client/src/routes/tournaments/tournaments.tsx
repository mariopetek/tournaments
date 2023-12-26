import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

export default function Tournaments() {
    const { getAccessTokenSilently, user } = useAuth0()
    useEffect(() => {
        async function fetchTournaments() {
            const response = await fetch(
                `${import.meta.env.VITE_API_SERVER_URL}/api/tournaments/${
                    user?.sub
                }`,
                {
                    headers: {
                        Authorization: `Bearer ${await getAccessTokenSilently()}`
                    }
                }
            )
            const data = await response.json()
            console.log(data)
        }
        fetchTournaments()
    }, [getAccessTokenSilently, user?.sub])
    return <div>Tournaments</div>
}
