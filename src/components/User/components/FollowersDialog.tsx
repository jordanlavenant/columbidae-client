import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInitials } from '@/lib/utils'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FollowerProps {
  followers: {
    id: string
    follower: {
      id: string
      username: string
      name: string
      Avatar: {
        id: string
        url: string
      } | null
    }
  }[]
}

const FollowersDialog = ({ followers }: FollowerProps) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleNavigate = (username: string) => {
    navigate(`/${username}`, {
      replace: true,
    })
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <p className="hover:cursor-pointer">
          <span className="font-semibold">{followers.length}</span>
          <span className="text-muted-foreground"> abonnés</span>
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[500px]">
        <AlertDialogHeader className="border-b">
          <AlertDialogTitle className="text-center">Abonnés</AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>
        <Input type="text" placeholder="Rechercher" />
        <section className="space-y-4 overflow-y-auto">
          {followers.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between">
              <div
                className="flex items-center gap-4 hover:cursor-pointer"
                onClick={() => handleNavigate(entry.follower.username)}
              >
                {/* Avatar */}
                <Avatar className="size-12">
                  <AvatarImage
                    src={entry.follower.Avatar?.url}
                    alt={entry.follower.name}
                  />
                  <AvatarFallback className="text-md font-mono">
                    {getInitials(entry.follower.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{entry.follower.username}</p>
                  <p className="text-muted-foreground">{entry.follower.name}</p>
                </div>
              </div>
              <Button variant="outline" className="text-sm">
                Suivre
              </Button>
            </div>
          ))}
        </section>
        <X
          className="absolute right-4 top-4 size-4 hover:cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default FollowersDialog
