import { PostEventType } from './post-event'

export type PostUpdate = {
  type: PostEventType.PostUpdate
  post: {
    id: string
    title: string
    content: string
    Author: {
      id: string
      name: string
      email: string
    }
    Comments: {
      id: string
      comment: string
      postId: string
      Author: {
        id: string
        name: string
        email: string
      }
    }[]
  }
}
