import { Toaster } from 'sonner'
import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider } from './hooks/use-auth'
import { EndpointProvider } from './hooks/use-endpoint'
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
          <Toaster position="top-center" />
          <Router />
        </AuthProvider>
      </EndpointProvider>
    </ThemeProvider>
  )
}

export default App
