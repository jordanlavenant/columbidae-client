import { ALL_ROUROU_TYPES } from '@/constants/rourou.consts'

const Rourous = () => {
  return (
    <div>
      <p>Rourou Selector</p>
      <div className="flex">
        {ALL_ROUROU_TYPES.map((rourou_type) => (
          <img
            className="w-[2em]"
            src={'./rourou_icons/' + rourou_type + '.png'}
          />
        ))}
      </div>
    </div>
  )
}

export default Rourous
