import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useEndpoint } from './use-endpoint'
import subscribePostEvents from '@/services/events/post/subscribe-post-events'
import type { Post } from '@/services/models/post/post'
import type { PostEventType } from '@/services/events/post/post-event'

type PostEventCallback = (data: { type: PostEventType; post: Post }) => void

type PostEventsContextType = {
  subscribe: (callback: PostEventCallback) => () => void
}

const PostEventsContext = createContext<PostEventsContextType | undefined>(
  undefined
)

type PostEventsProviderProps = {
  children: ReactNode
}

export const PostEventsProvider = ({ children }: PostEventsProviderProps) => {
  const endpoint = useEndpoint()
  const eventSourceRef = useRef<EventSource | null>(null)
  const listenersRef = useRef<Set<PostEventCallback>>(new Set())

  useEffect(() => {
    // unique EventSource
    const eventSource = subscribePostEvents(endpoint)
    eventSourceRef.current = eventSource

    // messages entrants
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type && data.post) {
          const { type, post } = data

          // notifier tous les listeners
          listenersRef.current.forEach((callback) => callback({ type, post }))
        }
      } catch (error) {
        console.error('Error parsing post event:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
    }

    // cleanup
    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [endpoint])

  // fonction pour s'abonner aux événements de posts
  const subscribe = (callback: PostEventCallback): (() => void) => {
    // ajouter le callback à la liste des listeners
    listenersRef.current.add(callback)

    // retourner une fonction de désabonnement
    return () => {
      listenersRef.current.delete(callback)
    }
  }

  return (
    <PostEventsContext.Provider value={{ subscribe }}>
      {children}
    </PostEventsContext.Provider>
  )
}

/**
 * Hook pour s'abonner aux événements de posts
 *
 * @param callback - Fonction appelée quand un événement de post arrive
 *
 * @example
 * usePostEvents(({ type, post }) => {
 *   if (type === PostEventType.PostUpdate) {
 *     setPosts(prev => {
 *       const existingIndex = prev.findIndex(p => p.id === post.id)
 *       if (existingIndex !== -1) {
 *         // Update existing post
 *         return prev.map((p, i) => i === existingIndex ? post : p)
 *       } else {
 *         // Add new post
 *         return [...prev, post]
 *       }
 *     })
 *   }
 * })
 */
export const usePostEvents = (callback: PostEventCallback) => {
  const context = useContext(PostEventsContext)
  if (context === undefined) {
    throw new Error('usePostEvents must be used within a PostEventsProvider')
  }

  useEffect(() => {
    // s'abonner aux événements
    const unsubscribe = context.subscribe(callback)

    // se désabonner au démontage du composant
    return unsubscribe
  }, [callback, context])
}
