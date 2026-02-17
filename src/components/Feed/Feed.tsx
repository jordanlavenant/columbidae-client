import fetchPosts from '@/services/functions/post/fetch-posts'
import subscribePostEvents from '@/services/events/post/subscribe-post-events'
import { useEffect, useState } from 'react'
import { useEndpoint } from '@/hooks/use-endpoint'
import { Button } from '../ui/button'
import { useAuth } from '@/hooks/use-auth'
import PostForm from '../PostForm/PostForm'
import type { Post } from '@/services/models/post/post'
import PostComponent from '../Post/Post'
import {
  PostEventType,
  type PostEvent,
} from '@/services/events/post/post-event'
import { toast } from 'sonner'
import { Separator } from '../ui/separator'

const Feed = () => {
  const { logout } = useAuth()

  const ENDPOINT = useEndpoint()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    try {
      fetchPosts(ENDPOINT).then(setPosts)
    } catch (error) {
      console.error(error)
    }
    const eventSource = subscribePostEvents(ENDPOINT)
    eventSource.onmessage = (msg: MessageEvent) => {
      const event: PostEvent = JSON.parse(msg.data)
      // Handle Error
      if (event.type === 'Error') {
        console.log('error')
        console.error(event.message)
        return
      }
      // Handle Post Update
      if (event.type === PostEventType.PostUpdate) {
        setPosts((prevPosts) => {
          const existingPostIndex = prevPosts.findIndex(
            (post) => post.id === event.post.id
          )
          if (existingPostIndex !== -1) {
            // Update existing post
            const updatedPosts = [...prevPosts]
            updatedPosts[existingPostIndex] = event.post
            return updatedPosts
          } else {
            // Add new post
            return [...prevPosts, event.post]
          }
        })
        // TODO: disable push notification if the user is currently on the feed page
        toast.success('De nouvelles publications sont disponibles !')
      }
    }
    eventSource.onerror = (err) => {
      console.error(err)
      eventSource.close()
    }
    return () => eventSource.close()
  }, [ENDPOINT])

  return (
    <section className="p-4">
      <section className="flex justify-between mb-4">
        <PostForm />
        <Button variant="destructive" onClick={logout}>
          Disconnect
        </Button>
      </section>
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
