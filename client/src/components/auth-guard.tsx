import { withAuthenticationRequired } from '@auth0/auth0-react'
import GlobalLoading from './global-loading'

export default function AuthGuard({
    component
}: {
    component: React.ComponentType
}) {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <GlobalLoading />
    })
    return <Component />
}
