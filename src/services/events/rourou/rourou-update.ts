import type { Post } from '../../models/post/post'
import type { RourouEventType } from './rourou-event'

export type RourouUpdate = {
  type: RourouEventType
  rourou: Post['Reacts'][0]
}
