import type { Post } from '../../models/post/post'
import { PostEventType } from './post-event'

export type PostUpdate = {
  type: PostEventType.PostUpdate
  post: Post
}
