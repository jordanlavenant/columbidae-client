import fetchPosts from '@/services/functions/post/fetch-posts'
import { useCallback, useEffect, useState } from 'react'
import { useEndpoint } from '@/hooks/use-endpoint'
import { usePostEvents } from '@/hooks/use-post-events'
import { Button } from '../ui/button'
import { useAuth } from '@/hooks/use-auth'
import PostForm from '../PostForm/PostForm'
import type { Post } from '@/services/models/post/post'
import PostComponent from '../Post/Post'
import { PostEventType } from '@/services/events/post/post-event'
import { toast } from 'sonner'
import { Separator } from '../ui/separator'

const Feed = () => {
  const { logout } = useAuth()
  const ENDPOINT = useEndpoint()
  const [posts, setPosts] = useState<Post[]>([])

  // Charger les posts initiaux
  useEffect(() => {
    try {
      fetchPosts(ENDPOINT).then(setPosts)
    } catch (error) {
      console.error(error)
    }
  }, [ENDPOINT])

  // s'abonner aux événements de posts
  const handlePostEvent = useCallback(
    (event: { type: PostEventType; post: Post }) => {
      const { type, post } = event

      if (type === PostEventType.PostUpdate) {
        setPosts((prevPosts) => {
          const existingPostIndex = prevPosts.findIndex((p) => p.id === post.id)
          if (existingPostIndex !== -1) {
            // Update existing post
            const updatedPosts = [...prevPosts]
            updatedPosts[existingPostIndex] = post
            return updatedPosts
          } else {
            // Add new post
            toast.success('De nouvelles publications sont disponibles !')
            return [...prevPosts, post]
          }
        })
      }
    },
    []
  )

  usePostEvents(handlePostEvent)

  return (
    <section className="p-4">
      {posts.length === 0 && <p>No posts available.</p>}
      <section className="mx-auto max-w-md">
        {posts
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((post) => (
            <div key={post.id}>
              <PostComponent post={post} />
              <Separator className="my-4" />
            </div>
          ))}
      </section>
    </section>
  )
}

export default Feed
