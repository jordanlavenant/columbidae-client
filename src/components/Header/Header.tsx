import PostForm from '@/components/PostForm/PostForm'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const Header = () => {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <img
          src="./columbidae_logo_app.svg"
          alt="Columbidae Logo"
          className="h-[3em]"
        />
        <h1 className="font-[Alan_Sans] font-extrabold text-3xl">Columbidae</h1>

        <PostForm />
        <Button variant="destructive" onClick={logout}>
          Disconnect
        </Button>
      </div>
    </header>
  )
}

export default Header
