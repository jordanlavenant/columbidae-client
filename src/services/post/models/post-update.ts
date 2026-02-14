import { PostEventType } from './post-event'

export type PostUpdate = {
  type: PostEventType.PostUpdate
  post: {
    id: string
    content: string
    createdAt: string
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
    Reacts: {
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
}
