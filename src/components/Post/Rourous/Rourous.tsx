import { useCallback, useMemo } from 'react'

import { ALL_ROUROU_TYPES, ROUROU_TYPES } from '@/constants/rourou.consts'
import { useAuth } from '@/hooks/use-auth'
import { useEndpoint } from '@/hooks/use-endpoint'
import RourouSelector from './RourouSelector/RourouSelector'

interface RourousProps {
  postId: string
  rourous: {
    id: string
    name: string
    createdAt: string
    postId: string
    Author: {
      id: string | undefined
      name: string
      email: string
    }
  }[]
}

const Rourous = ({ postId, rourous }: RourousProps) => {
  const { currentUser } = useAuth()
  const endpoint = useEndpoint()

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

  const isRourouSelectedByUser = useCallback(
    (rourouType: ROUROU_TYPES) => {
      return rourous.some(
        (oneRourou) =>
          oneRourou.name === rourouType &&
          oneRourou.Author.id === currentUser?.id
      )
    },
    [rourous, currentUser?.id]
  )

  const handleRourouSelect = async (selectedRourou: ROUROU_TYPES) => {
    try {
      const postRourouResponse = await fetch(`${endpoint}/api/rourous`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          authorId: currentUser!.id,
          postId,
          rourouName: selectedRourou,
        }),
      })

      if (!postRourouResponse.ok) {
        throw new Error("Erreur lors de l'envoi du Rourou")
      }
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {!hasNoRourou && (
        <div className="flex gap-2 p-1 border-1 border-solid inset-shadow-sm rounded-full w-fit">
          {ALL_ROUROU_TYPES.map((rourouType) => {
            const count = rourouGroups[rourouType]

            if (count === 0) return null

            const isSelected = isRourouSelectedByUser(rourouType)

            return (
              <div
                key={rourouType}
                className={`flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-950 border border-green-800 p-1 rounded-full'
                    : ''
                }`}
              >
                <img
                  src={`./rourou_icons/${rourouType}.png`}
                  alt={rourouType}
                  className="h-[1.5em]"
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
