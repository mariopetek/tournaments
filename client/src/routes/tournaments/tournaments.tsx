import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function Tournaments() {
    const { getAccessTokenSilently } = useAuth0()
    const { isPending, error, data } = useQuery({
        queryKey: ['tournaments'],
        queryFn: async () => {
            const accessToken = await getAccessTokenSilently()
            const response = await axios.get(
                `${import.meta.env.VITE_API_SERVER_URL}/api/tournaments`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )
            return response.data
        }
    })

    if (isPending) return <div>Loading...</div>
    if (error) return 'An error has occurred: ' + error.message
    return <div>{JSON.stringify(data)}</div>
}
