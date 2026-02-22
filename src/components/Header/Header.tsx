import { useEffect, useState } from 'react'
import { CircleUserRound, LogOutIcon } from 'lucide-react'

import PostForm from '@/components/PostForm/PostForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { useEndpoint } from '@/hooks/use-endpoint'
import { getInitials } from '@/lib/utils'
import fetchUser from '@/services/functions/user/fetch-user'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth()
  const ENDPOINT = useEndpoint()
  const navigate = useNavigate()

  const [userAvatarURL, setUserAvatarURL] = useState('')
  const [userName, setUserName] = useState('')

  // Fetching User's complete name and Avatar's URL
  useEffect(() => {
    if (currentUser) {
      fetchUser(ENDPOINT, currentUser.username).then((data) => {
        if (data.Avatar != null) {
          setUserAvatarURL(data.Avatar.url)
        }
        setUserName(data.name)
      })
    }
  }, [currentUser, ENDPOINT])

  return (
    isAuthenticated && (
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="bg-green-500/20 border-b border-green-600 container mx-auto flex h-14 items-center justify-between px-4">
          {/* Columbidae Logo */}
          <div
            className="flex gap-2 items-center hover:cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/columbidae_logo_app.svg"
              alt="Columbidae Logo"
              className="h-[2.5em]"
            />
            <h1 className="font-[Alan_Sans] font-extrabold text-3xl">
              Columbidae
            </h1>
          </div>

          <div className="flex gap-4 items-center">
            {/* Create Post command */}
            <PostForm />

            {/* Account Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-10 hover:cursor-pointer">
                    <AvatarImage
                      src={userAvatarURL}
                      alt={userName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-md font-mono border">
                      {userName && getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                <div className="flex flex-col p-2">
                  <p className="font-bold">{userName}</p>
                  <p className="font-light text-xs">{currentUser?.username}</p>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => navigate(`/${currentUser?.username}`)}
                  >
                    <CircleUserRound />
                    Mon Profil
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    variant="destructive"
                    onClick={logout}
                  >
                    <LogOutIcon />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    )
  )
}

export default Header
