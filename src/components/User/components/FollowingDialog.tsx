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

interface FollowedProps {
  following: {
    id: string
    followed: {
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

const FollowingDialog = ({ following }: FollowedProps) => {
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
          <span className="font-semibold">{following.length}</span>
          <span className="text-muted-foreground"> suivi(e)s</span>
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[500px]">
        <AlertDialogHeader className="border-b">
          <AlertDialogTitle className="text-center">Suivi(e)s</AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>
        <Input type="text" placeholder="Rechercher" />
        <section className="space-y-4 overflow-y-auto">
          {following.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between">
              <div
                className="flex items-center gap-4 hover:cursor-pointer"
                onClick={() => handleNavigate(entry.followed.username)}
              >
                {/* Avatar */}
                <Avatar className="size-12">
                  <AvatarImage
                    src={entry.followed.Avatar?.url}
                    alt={entry.followed.name}
                  />
                  <AvatarFallback className="text-md font-mono">
                    {getInitials(entry.followed.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{entry.followed.username}</p>
                  <p className="text-muted-foreground">{entry.followed.name}</p>
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

export default FollowingDialog
