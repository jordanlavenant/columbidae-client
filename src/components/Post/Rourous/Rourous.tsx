import { useCallback, useMemo, useState } from 'react'

import { ALL_ROUROU_TYPES, ROUROU_TYPES } from '@/constants/rourou.consts'
import { useAuth } from '@/hooks/use-auth'
import type { Post } from '@/services/models/post/post'
import { useEndpoint } from '@/hooks/use-endpoint'
import { useRourouEvents } from '@/hooks/use-rourou-events'
import { RourouEventType } from '@/services/events/rourou/rourou-event'
import RourouSelector from './RourouSelector/RourouSelector'
import createRourou, {
  type CreateRourouPayload,
} from '@/services/functions/rourou/create-rourou'
import deleteRourou from '@/services/functions/rourou/delete-rourou'
import patchRourou from '@/services/functions/rourou/patch-rourou'
import { cn } from '@/lib/utils'

const Rourous = ({
  rourous: initialRourous,
  postId,
}: {
  rourous: Post['Reacts']
  postId: string
}) => {
  const { currentUser } = useAuth()
  const endpoint = useEndpoint()

  // State local pour gérer les rourous
  const [rourous, setRourous] = useState<Post['Reacts']>(initialRourous)

  // s'abonner aux événements de rourous pour ce post
  const handleRourouEvent = useCallback(
    (event: { type: RourouEventType; rourou: Post['Reacts'][0] }) => {
      const { type, rourou } = event

      setRourous((prev) => {
        switch (type) {
          case RourouEventType.RourouCreated:
            // Éviter les doublons si le rourou existe déjà
            if (prev.some((r) => r.id === rourou.id)) {
              return prev
            }
            // Ajouter le nouveau rourou
            return [...prev, rourou]

          case RourouEventType.RourouDeleted:
            // Retirer le rourou supprimé
            return prev.filter((r) => r.id !== rourou.id)

          case RourouEventType.RourouUpdated:
            // Mettre à jour le rourou modifié
            return prev.map((r) => (r.id === rourou.id ? rourou : r))

          default:
            return prev
        }
      })
    },
    []
  )

  useRourouEvents(postId, handleRourouEvent)

  const rourouGroups: Record<string, number> = useMemo(() => {
    const groupedRourous = Object.fromEntries(
      ALL_ROUROU_TYPES.map((type) => [type, 0])
    ) as Record<string, number>

    rourous.forEach((rourou) => {
      if (rourou.name in groupedRourous) {
        groupedRourous[rourou.name]++
      }
    })

    return groupedRourous
  }, [rourous])

  const hasNoRourou: boolean = useMemo(() => {
    for (let key in rourouGroups) {
      if (rourouGroups[key] != 0) return false
    }
    return true
  }, [rourous])

  const rourouSelectedByUser = useMemo(() => {
    return rourous.find((oneRourou) => oneRourou.Author.id === currentUser?.id)
  }, [rourous, currentUser?.id])

  const isRourouSelectedByUser = useCallback(
    (rourouType: ROUROU_TYPES) => {
      return rourouSelectedByUser?.name === rourouType
    },
    [rourous, currentUser?.id]
  )

  const handleRourouSelect = async (selectedRourou: ROUROU_TYPES) => {
    try {
      if (rourouSelectedByUser != undefined) {
        // Delete rourou case
        if (isRourouSelectedByUser(selectedRourou)) {
          const deleteRourouResponse = await deleteRourou(
            endpoint,
            rourouSelectedByUser.id
          )
          if (!deleteRourouResponse.ok) {
            throw new Error('Erreur lors de la suppression du Rourou')
          }
        }

        // Update rourou case
        else {
          const patchRourouResponse = await patchRourou(
            endpoint,
            rourouSelectedByUser.id,
            selectedRourou
          )

          if (!patchRourouResponse.ok) {
            throw new Error('Erreur lors de la mise à jour du Rourou')
          }
        }
      }

      // Create new rourou case
      else {
        const payload: CreateRourouPayload = {
          authorId: currentUser!.id,
          postId,
          rourouName: selectedRourou,
        }
        const postRourouResponse = await createRourou(endpoint, payload)
        if (!postRourouResponse.ok) {
          throw new Error("Erreur lors de l'envoi du Rourou")
        }
      }
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  return (
    <div className="flex items-center gap-1 h-10">
      {!hasNoRourou && (
        <div className="flex gap-2 p-1 border-1 border-solid inset-shadow-sm rounded-full w-fit">
          {ALL_ROUROU_TYPES.map((rourouType) => {
            const count = rourouGroups[rourouType]

            if (count === 0) return null

            const isSelected = isRourouSelectedByUser(rourouType)

            return (
              <div
                key={rourouType}
                className={cn(
                  'flex items-center gap-2',
                  isSelected
                    ? 'bg-emerald-950 border border-green-800 p-1 rounded-full'
                    : ''
                )}
              >
                <img
                  src={`/rourou_icons/${rourouType}.png`}
                  alt={rourouType}
                  className="size-6 cursor-pointer"
                  onClick={() => handleRourouSelect(rourouType)}
                />
                <p className="text-xs">{count}</p>
              </div>
            )
          })}
        </div>
      )}
      <RourouSelector onRourouSelect={handleRourouSelect} />
    </div>
  )
}

export default Rourous
