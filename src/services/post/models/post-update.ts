import { PostEventType } from './post-event'

export type PostUpdate = {
  type: PostEventType.PostUpdate
  post: {
    id: string
    title: string
    content: string
    authorId: string
  }
}
