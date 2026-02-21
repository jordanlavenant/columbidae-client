import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useEndpoint } from './use-endpoint'
import subscribeCommentEvents from '@/services/events/comment/subscribe-comment-events'
import type { Post } from '@/services/models/post/post'
import type { CommentEventType } from '@/services/events/comment/comment-event'

type CommentEventCallback = (data: {
  type: CommentEventType
  comment: Post['Comments'][0]
}) => void

type CommentEventsContextType = {
  subscribe: (postId: string, callback: CommentEventCallback) => () => void
}

const CommentEventsContext = createContext<
  CommentEventsContextType | undefined
>(undefined)

type CommentEventsProviderProps = {
  children: ReactNode
}

export const CommentEventsProvider = ({
  children,
}: CommentEventsProviderProps) => {
  const endpoint = useEndpoint()
  const eventSourceRef = useRef<EventSource | null>(null)
  const listenersRef = useRef<Map<string, Set<CommentEventCallback>>>(new Map())

  useEffect(() => {
    // unique EventSource
    const eventSource = subscribeCommentEvents(endpoint)
    eventSourceRef.current = eventSource

    // messages entrants
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type && data.comment) {
          const { type, comment } = data
          const postId = comment.postId

          // notifier tous les listeners abonnés à ce postId
          const callbacks = listenersRef.current.get(postId)
          if (callbacks) {
            callbacks.forEach((callback) => callback({ type, comment }))
          }
        }
      } catch (error) {
        console.error('Error parsing comment event:', error)
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

  // fonction pour s'abonner aux événements d'un post spécifique
  const subscribe = (
    postId: string,
    callback: CommentEventCallback
  ): (() => void) => {
    // ajouter le callback à la liste des listeners pour ce postId
    if (!listenersRef.current.has(postId)) {
      listenersRef.current.set(postId, new Set())
    }
    listenersRef.current.get(postId)!.add(callback)

    // retourner une fonction de désabonnement
    return () => {
      const callbacks = listenersRef.current.get(postId)
      if (callbacks) {
        callbacks.delete(callback)
        // nettoyer la Map si plus de listeners pour ce postId
        if (callbacks.size === 0) {
          listenersRef.current.delete(postId)
        }
      }
    }
  }

  return (
    <CommentEventsContext.Provider value={{ subscribe }}>
      {children}
    </CommentEventsContext.Provider>
  )
}

/**
 * Hook pour s'abonner aux événements de commentaires d'un post spécifique
 *
 * @param postId - L'ID du post dont on veut écouter les commentaires
 * @param callback - Fonction appelée quand un événement de commentaire arrive
 *
 * @example
 * useCommentEvents(postId, ({ type, comment }) => {
 *   switch (type) {
 *     case CommentEventType.CommentCreated:
 *       setComments(prev => [comment, ...prev])
 *       break
 *     case CommentEventType.CommentDeleted:
 *       setComments(prev => prev.filter(c => c.id !== comment.id))
 *       break
 *     case CommentEventType.CommentUpdated:
 *       setComments(prev => prev.map(c => c.id === comment.id ? comment : c))
 *       break
 *   }
 * })
 */
export const useCommentEvents = (
  postId: string,
  callback: CommentEventCallback
) => {
  const context = useContext(CommentEventsContext)
  if (context === undefined) {
    throw new Error(
      'useCommentEvents must be used within a CommentEventsProvider'
    )
  }

  useEffect(() => {
    // s'abonner aux événements pour ce postId
    const unsubscribe = context.subscribe(postId, callback)

    // se désabonner au démontage du composant
    return unsubscribe
  }, [postId, callback, context])
}
