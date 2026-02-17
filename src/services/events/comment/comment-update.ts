import type { Post } from '../../models/post/post'
import type { CommentEventType } from './comment-event'

export type CommentUpdate = {
  type: CommentEventType.CommentUpdate
  comment: Post['Comments'][0]
}
