import type { Post } from './post'
import { PostEventType } from './post-event'

export type PostUpdate = {
  type: PostEventType.PostUpdate
  post: Post
}
