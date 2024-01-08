import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './app.tsx'
import './index.css'
import Home from './routes/home/home.tsx'
import Tournaments from './routes/tournaments/tournaments.tsx'
import Tournament from './routes/tournaments/id/tournament.tsx'
import Leaderboard from './routes/tournaments/id/leaderboard/leaderboard.tsx'
import NotFound from './components/not-found.tsx'
import AuthGuard from './components/auth-guard.tsx'
import Auth0ProviderWithNavigate from './components/auth0-provider-with-navigate.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Auth0ProviderWithNavigate>
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route index element={<Home />} />
                            <Route path="tournaments">
                                <Route
                                    index
                                    element={
                                        <AuthGuard component={Tournaments} />
                                    }
                                />
                                <Route path=":id">
                                    <Route
                                        index
                                        element={
                                            <AuthGuard component={Tournament} />
                                        }
                                    />
                                    <Route
                                        path="leaderboard"
                                        element={
                                            <AuthGuard
                                                component={Leaderboard}
                                            />
                                        }
                                    />
                                </Route>
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Auth0ProviderWithNavigate>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
)
