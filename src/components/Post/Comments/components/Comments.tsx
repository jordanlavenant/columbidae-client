import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { useEndpoint } from '@/hooks/use-endpoint'
import { formatTimeDifference } from '@/lib/time'
import { cn } from '@/lib/utils'
import type { Post } from '@/services/models/post/post'
import deleteComment from '@/services/functions/comment/delete-comment'
import { Ellipsis } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const Comments = ({
  className,
  comments,
}: {
  className?: string
  comments: Post['Comments']
}) => {
  const { currentUser } = useAuth()
  const currentUserId = currentUser?.id
  const endpoint = useEndpoint()

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteComment(endpoint, commentId)
      if (response.ok) {
        // TODO: La mise à jour se fera via le système d'événements SSE
      } else {
        console.error('Erreur lors de la suppression du commentaire')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error)
    }
  }

  return (
    <section className={cn('p-2 overflow-y-auto space-y-6 py-4', className)}>
      {comments.length === 0 ? (
        <p className="mt-8 p-4 text-center text-sm text-muted-foreground">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </p>
      ) : (
        comments
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((entry) => (
            <div key={entry.id} className="flex items-start gap-x-2 relative">
              {entry.Author?.id === currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Ellipsis
                      size={16}
                      className="absolute top-1 right-2 text-muted-foreground"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="text-red-500 hover:bg-red-50 hover:cursor-pointer"
                      onClick={() => handleDeleteComment(entry.id)}
                    >
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Avatar className="size-10">
                <AvatarImage
                  src={entry.Author.Avatar?.url}
                  alt={entry.Author.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-md font-mono">
                  {entry.Author?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-x-2">
                  <p className="text-sm">{entry.Author.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeDifference(entry.createdAt)}
                  </p>
                </div>
                <p>{entry.comment}</p>
              </div>
            </div>
          ))
      )}
    </section>
  )
}

export default Comments
