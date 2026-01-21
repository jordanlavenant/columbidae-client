import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { authService } from '@/services/auth'

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  isAuthenticated: boolean
  currentUser: User | null
  logout: () => void
  isLoading: boolean
}

const AuthProviderContext = createContext<AuthContextType | undefined>(
  undefined
)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const token = authService.getToken()
    const user = authService.getUser()

    if (token && user) {
      setIsAuthenticated(true)
      setCurrentUser(user)
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  return (
    <AuthProviderContext.Provider
      value={{ isAuthenticated, currentUser, logout, isLoading }}
    >
      {children}
    </AuthProviderContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
