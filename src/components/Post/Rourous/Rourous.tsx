import { useMemo } from 'react'

import { ALL_ROUROU_TYPES, ROUROU_TYPES } from '@/constants/rourou.consts'

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
  const rourouGroups = useMemo(() => {
    const groupedRourous = Object.fromEntries(
      ALL_ROUROU_TYPES.map((type) => [type, 0])
    ) as Record<ROUROU_TYPES, number>

    rourous.forEach((rourou) => {
      if (rourou.name in groupedRourous) {
        groupedRourous[rourou.name as ROUROU_TYPES]++
      }
    })

    return groupedRourous
  }, [rourous])

  console.debug('(i) Rourou Groups')
  console.debug(rourouGroups)

  return (
    <div>
      <p>Rourou Selector</p>
      <div className="flex gap-2 py-1">
        {ALL_ROUROU_TYPES.map((rourouType) => {
          const count = rourouGroups[rourouType]

          if (count === 0) return null

          return (
            <div key={rourouType} className="flex items-center gap-2 h-[1.5em]">
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
    </div>
  )
}

export default Rourous
