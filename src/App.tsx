import { Toaster } from 'sonner'
import './App.css'
import Header from './components/Header/Header'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider } from './hooks/use-auth'
import { EndpointProvider } from './hooks/use-endpoint'
import { CommentEventsProvider } from './hooks/use-comment-events'
import { RourouEventsProvider } from './hooks/use-rourou-events'
import { PostEventsProvider } from './hooks/use-post-events'
import Router from './Router'

const App = () => {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT

  if (!ENDPOINT) {
    throw new Error('ENDPOINT is not defined')
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <EndpointProvider endpoint={ENDPOINT}>
        <AuthProvider>
          <PostEventsProvider>
            <CommentEventsProvider>
              <RourouEventsProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />

                  <main className="flex-1">
                    <Toaster position="top-center" />
                    <Router />
                  </main>
                </div>
              </RourouEventsProvider>
            </CommentEventsProvider>
          </PostEventsProvider>
        </AuthProvider>
      </EndpointProvider>
    </ThemeProvider>
  )
}

export default App
