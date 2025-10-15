import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <section>
        <Button>coucou</Button>
      </section>
    </ThemeProvider>
  )
}

export default App
