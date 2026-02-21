import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useEndpoint } from './use-endpoint'
import type { Post } from '@/services/models/post/post'
import subscribeRourouEvents from '@/services/events/rourou/subscribe-rourou-events'
import type { RourouEventType } from '@/services/events/rourou/rourou-event'

type RourouEventCallback = (data: {
  type: RourouEventType
  rourou: Post['Reacts'][0]
}) => void

type RourouEventsContextType = {
  subscribe: (postId: string, callback: RourouEventCallback) => () => void
}

const RourouEventsContext = createContext<RourouEventsContextType | undefined>(
  undefined
)

type RourouEventsProviderProps = {
  children: ReactNode
}

export const RourouEventsProvider = ({
  children,
}: RourouEventsProviderProps) => {
  const endpoint = useEndpoint()
  const eventSourceRef = useRef<EventSource | null>(null)
  const listenersRef = useRef<Map<string, Set<RourouEventCallback>>>(new Map())

  useEffect(() => {
    // unique EventSource
    const eventSource = subscribeRourouEvents(endpoint)
    eventSourceRef.current = eventSource

    // messages entrants
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type && data.rourou) {
          const { type, rourou } = data
          const postId = rourou.postId

          // otifier tous les listeners abonnés à ce postId
          const callbacks = listenersRef.current.get(postId)
          if (callbacks) {
            callbacks.forEach((callback) => callback({ type, rourou }))
          }
        }
      } catch (error) {
        console.error('Error parsing rourou event:', error)
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
    callback: RourouEventCallback
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
    <RourouEventsContext.Provider value={{ subscribe }}>
      {children}
    </RourouEventsContext.Provider>
  )
}

/**
 * Hook pour s'abonner aux événements de rourous d'un post spécifique
 *
 * @param postId - L'ID du post dont on veut écouter les rourous
 * @param callback - Fonction appelée quand un événement de rourou arrive
 *
 * @example
 * useRourouEvents(postId, ({ type, rourou }) => {
 *   switch (type) {
 *     case RourouEventType.RourouCreated:
 *       setRourous(prev => [rourou, ...prev])
 *       break
 *     case RourouEventType.RourouDeleted:
 *       setRourous(prev => prev.filter(r => r.id !== rourou.id))
 *       break
 *     case RourouEventType.RourouUpdated:
 *       setRourous(prev => prev.map(r => r.id === rourou.id ? rourou : r))
 *       break
 *   }
 * })
 */
export const useRourouEvents = (
  postId: string,
  callback: RourouEventCallback
) => {
  const context = useContext(RourouEventsContext)
  if (context === undefined) {
    throw new Error(
      'useRourouEvents must be used within a RourouEventsProvider'
    )
  }

  useEffect(() => {
    // s'abonner aux événements pour ce postId
    const unsubscribe = context.subscribe(postId, callback)

    // se désabonner au démontage du composant
    return unsubscribe
  }, [postId, callback, context])
}
