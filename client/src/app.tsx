import { Outlet } from 'react-router-dom'
import Header from './components/header'
import { useAuth0 } from '@auth0/auth0-react'
import GlobalLoading from './components/global-loading'

export default function App() {
    const { isLoading } = useAuth0()
    return isLoading ? (
        <GlobalLoading />
    ) : (
        <>
            <Header />
            <Outlet />
        </>
    )
}
