import { CirclePlus } from 'lucide-react'
import { useState } from 'react'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ALL_ROUROU_TYPES,
  FRENCH_ROUROU_LABELS,
  ROUROU_TYPES,
} from '@/constants/rourou.consts'

interface RourouSelectorProps {
  onRourouSelect: (selectedRourou: ROUROU_TYPES) => void
}

const RourouSelector = ({ onRourouSelect }: RourouSelectorProps) => {
  const [isRourouSelectorOpen, setIsRourouSelectorOpen] =
    useState<boolean>(false)

  return (
    <Popover
      open={isRourouSelectorOpen}
      onOpenChange={() => setIsRourouSelectorOpen(!isRourouSelectorOpen)}
    >
      <PopoverTrigger asChild>
        <CirclePlus className="hover:cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="flex justify-between gap-1 w-fit">
        {ALL_ROUROU_TYPES.map((rourouType) => (
          <HoverCard key={rourouType} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <img
                src={`/rourou_icons/${rourouType}.png`}
                alt={FRENCH_ROUROU_LABELS[rourouType]}
                key={rourouType}
                className="h-[2em]"
                onClick={() => {
                  onRourouSelect(rourouType)
                  setIsRourouSelectorOpen(false)
                }}
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              <p className="text-xs">{FRENCH_ROUROU_LABELS[rourouType]}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </PopoverContent>
    </Popover>
  )
}

export default RourouSelector
