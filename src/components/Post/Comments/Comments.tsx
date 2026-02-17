import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useEndpoint } from '@/hooks/use-endpoint'
import { formatTimeDifference } from '@/lib/time'
import createComment, {
  type CreateCommentPayload,
} from '@/services/functions/comment/create-comment'
import type { Post } from '@/services/models/post/post'
import { MessageCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'

const Comments = ({
  postId,
  comments: initialComments,
}: {
  postId: string
  comments: Post['Comments']
}) => {
  const { currentUser } = useAuth()
  const ENDPOINT = useEndpoint()

  // States
  const [comments, setComments] = useState<Post['Comments']>(initialComments)
  const [currComment, setCurrComment] = useState('')

  // Functions
  const handleAddComment = async (e: FormEvent) => {
    try {
      e.preventDefault()
      if (!currentUser || !currComment.trim()) return

      // Create comment
      const payload: CreateCommentPayload = {
        comment: currComment,
        authorId: currentUser.id,
        postId,
      }

      const commentResponse = await createComment(ENDPOINT, payload)

      if (!commentResponse.ok) {
        throw new Error('Erreur lors de la création du commentaire')
      }

      // Update local state with the newly created comment
      const createdComment = await commentResponse.json()
      setComments((prev) => [createdComment, ...prev])
      // Clear input
      setCurrComment('')
    } catch (err) {
      console.error(
        'Error adding comment:',
        err instanceof Error ? err.message : err
      )
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <MessageCircle className="hover:cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent className="border h-[500px] max-w-md mx-auto backdrop-blur-sm bg-background/50">
        <DrawerHeader className="border-b">
          <DrawerTitle>Commentaires</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <section className="p-2 overflow-y-auto space-y-6 my-4">
          {comments.length === 0 ? (
            <p className="mt-8 p-4 text-center text-muted-foreground">
              Aucun commentaire pour ce post.
            </p>
          ) : (
            comments
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-x-2 relative"
                >
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
        <DrawerFooter className="border-t">
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <Input
              className="flex-1 h-14 sm:h-10"
              placeholder="Ajouter un commentaire..."
              value={currComment}
              onChange={(e) => setCurrComment(e.target.value)}
            />
            <Button type="submit" className="h-14 sm:h-10">
              Publier
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default Comments
