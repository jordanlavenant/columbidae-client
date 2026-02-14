import fetchPosts from '@/services/post/fetch-post'
import {
  PostEventType,
  type PostEvent,
} from '@/services/post/models/post-event'
import subscribePostEvents from '@/services/post/subscribe-post-events'
import { useEffect, useState } from 'react'
import Post from '../Post/Post'
import { useEndpoint } from '@/hooks/use-endpoint'
import { Button } from '../ui/button'
import { useAuth } from '@/hooks/use-auth'
import PostForm from '../PostForm/PostForm'

const Feed = () => {
  const { logout } = useAuth()

  const ENDPOINT = useEndpoint()
  const [posts, setPosts] = useState<
    {
      id: string
      content: string
      createdAt: string
      Author: {
        id: string
        name: string
        email: string
      }
      Comments: {
        id: string
        comment: string
        postId: string
        Author: {
          id: string
          name: string
          email: string
        }
      }[]
      Reacts: {
        id: string
        name: string
        createdAt: string
        postId: string
        Author: {
          id: string
          name: string
          email: string
        }
      }[]
    }[]
  >([])

  useEffect(() => {
    try {
      fetchPosts(ENDPOINT).then(setPosts)
    } catch (error) {
      console.error(error)
    }
    const eventSource = subscribePostEvents(ENDPOINT)
    eventSource.onmessage = (msg: MessageEvent) => {
      const event: PostEvent = JSON.parse(msg.data)
      if (event.type === 'Error') {
        console.log('error')
        console.error(event.message)
        return
      }
      if (event.type === PostEventType.PostUpdate) {
        // ! DEBUG LOGGING
        console.log('success')
        console.log(event)
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
      }
    }
    eventSource.onerror = (err) => {
      console.error(err)
      eventSource.close()
    }
    return () => eventSource.close()
  }, [ENDPOINT, setPosts])

  return (
    <section className="p-4">
      <section className="flex justify-between mb-4">
        <PostForm />
        <Button variant="destructive" onClick={logout}>
          Disconnect
        </Button>
      </section>
      {posts.length === 0 && <p>No posts available.</p>}
      {posts
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((post) => (
          <Post post={post} key={post.id} />
        ))}
    </section>
  )
}

export default Feed
