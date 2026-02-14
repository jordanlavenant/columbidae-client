import { useMemo } from 'react'

import { ALL_ROUROU_TYPES } from '@/constants/rourou.consts'

interface RourousProps {
  rourous: {
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
}

const Rourous = ({ rourous }: RourousProps) => {
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

  return (
    <div>
      <p>Rourou Selector</p>
      {!hasNoRourou && (
        <div className="flex gap-2 p-1 border-1 border-solid rounded-full w-fit">
          {ALL_ROUROU_TYPES.map((rourouType) => {
            const count = rourouGroups[rourouType]

            if (count === 0) return null

            return (
              <div
                key={rourouType}
                className="flex items-center gap-2 h-[1.5em]"
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
    </div>
  )
}

export default Rourous
