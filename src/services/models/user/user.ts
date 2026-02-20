import type { Post } from '@/services/models/post/post'

export type User = {
  id: string
  email: string
  username: string
  name: string
  Avatar: {
    id: string
    url: string
    key: string
    mimeType: string
  }
  Posts: Post[]
  Followers: {
    id: string
    follower: {
      id: string
      username: string
      name: string
      Avatar: {
        id: string
        url: string
      }
    }
  }[]
  Following: {
    id: string
    followed: {
      id: string
      username: string
      name: string
      Avatar: {
        id: string
        url: string
      }
    }
  }[]
}
