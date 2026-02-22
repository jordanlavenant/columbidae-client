import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth'
import { useAuth } from '@/hooks/use-auth'

const LoginForm = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login(email, password)

      // Trigger a page reload to update the auth context
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex md:flex-row flex-col maxitems-stretch gap-6 mb-8">
        <div className="flex md:items-center justify-center order-last md:order-first">
          <img
            src="./columbidae_welcoming_rourou.png"
            alt="Columbidae Welcoming Rourou"
            className="h-[10em] object-contain"
          />
        </div>

        <div className="flex flex-col justify-center items-center h-[10em]">
          <p className="text-lg">Bienvenue sur</p>

          <div className="flex gap-2 items-center">
            <img
              src="./columbidae_logo_app.svg"
              alt="Columbidae Logo"
              className="h-[3em]"
            />
            <p className="font-[Alan_Sans] font-extrabold text-4xl">
              Columbidae
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6 sm:border sm:rounded-lg"
      >
        <h1 className="font-[Alan_Sans] text-2xl font-bold">Connexion</h1>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Entrer le mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Authentification...' : 'Se connecter'}
        </Button>

        <div className="flex justify-center items-center gap-2">
          <p className="text-sm text-center">Pas encore de compte ?</p>
          <Button
            variant="link"
            type="button"
            className="text-blue-600 hover:cursor-pointer p-1"
            onClick={() => navigate('/register')}
          >
            S'inscrire
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
