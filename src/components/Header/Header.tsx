import PostForm from '@/components/PostForm/PostForm'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { LogOutIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const Header = () => {
  const { currentUser, logout } = useAuth()
  const [isUserConnected, setIsUserConnected] = useState<boolean>(true)

  useEffect(() => {
    if (currentUser != undefined) {
      setIsUserConnected(true)
    } else {
      setIsUserConnected(false)
    }
  }, [currentUser])

  return (
    isUserConnected && (
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex gap-2 items-center">
            <img
              src="./columbidae_logo_app.svg"
              alt="Columbidae Logo"
              className="h-[3em]"
            />
            <h1 className="font-[Alan_Sans] font-extrabold text-3xl">
              Columbidae
            </h1>
          </div>

          <div className="flex gap-2 items-center">
            <PostForm />
            <Button variant="destructive" onClick={logout}>
              <LogOutIcon />
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>
    )
  )
}

export default Header
