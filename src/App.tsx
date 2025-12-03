import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import { useEffect, useState } from 'react'
import subscribePostEvents from './services/post/subscribe-post-events'
import {
  PostEventType,
  type PostEvent,
} from './services/post/models/post-event'
import fetchPosts from './services/post/fetch-post'

const App = () => {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT

  if (!ENDPOINT) {
    throw new Error('ENDPOINT is not defined')
  }

  const [posts, setPosts] = useState<
    {
      id: string
      title: string
      content: string
      authorId: string
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
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <section className="p-4">
        {posts.length === 0 && <p>No posts available.</p>}
        {posts.map((post) => (
          <div key={post.id} className="mb-4 p-2 border rounded">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">Author ID: {post.authorId}</p>
          </div>
        ))}
      </section>
    </ThemeProvider>
  )
}

export default App
