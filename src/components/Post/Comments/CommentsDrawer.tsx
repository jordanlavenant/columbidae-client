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
import createComment, {
  type CreateCommentPayload,
} from '@/services/functions/comment/create-comment'
import type { Post } from '@/services/models/post/post'
import { MessageCircle } from 'lucide-react'
import { useCallback, useState, type FormEvent } from 'react'
import Comments from './components/Comments'
import { cn } from '@/lib/utils'
import { CommentEventType } from '@/services/events/comment/comment-event'
import { useCommentEvents } from '@/hooks/use-comment-events'

const CommentsDrawer = ({
  className,
  postId,
  comments: initialComments,
}: {
  className?: string
  postId: string
  comments: Post['Comments']
}) => {
  const { currentUser } = useAuth()
  const ENDPOINT = useEndpoint()

  // States
  const [comments, setComments] = useState<Post['Comments']>(initialComments)
  const [currComment, setCurrComment] = useState('')

  // s'abonner aux événements de commentaires pour ce post
  const handleCommentEvent = useCallback(
    (event: { type: CommentEventType; comment: Post['Comments'][0] }) => {
      const { type, comment } = event

      setComments((prev) => {
        switch (type) {
          case CommentEventType.CommentCreated:
            // Éviter les doublons si le commentaire existe déjà
            if (prev.some((c) => c.id === comment.id)) {
              return prev
            }
            // Ajouter le nouveau commentaire au début
            return [comment, ...prev]

          case CommentEventType.CommentDeleted:
            // Retirer le commentaire supprimé
            return prev.filter((c) => c.id !== comment.id)

          case CommentEventType.CommentUpdated:
            // Mettre à jour le commentaire modifié
            return prev.map((c) => (c.id === comment.id ? comment : c))

          default:
            return prev
        }
      })
    },
    []
  )

  useCommentEvents(postId, handleCommentEvent)

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
        <MessageCircle className={cn('hover:cursor-pointer', className)} />
      </DrawerTrigger>
      <DrawerContent className="border h-[500px] max-w-md mx-auto backdrop-blur-sm bg-background/50">
        <DrawerHeader className="border-b">
          <DrawerTitle>Commentaires</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <Comments comments={comments} />

        <DrawerFooter className="border-t">
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <Input
              className="flex-1 h-14 sm:h-10"
              placeholder="Ajouter un commentaire..."
              value={currComment}
              onChange={(e) => setCurrComment(e.target.value)}
              autoFocus
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

export default CommentsDrawer
