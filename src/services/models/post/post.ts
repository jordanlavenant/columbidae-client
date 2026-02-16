export type Post = {
  id: string
  content: string
  createdAt: string
  Author: {
    id: string
    username: string
    name: string
    email: string
    Avatar: {
      url: string
    } | null
  }
  Comments: {
    id: string
    comment: string
    postId: string
    Author: {
      id: string
      username: string
      name: string
      email: string
      Avatar: {
        url: string
      } | null
    }
  }[]
  Reacts: {
    id: string
    name: string
    createdAt: string
    postId: string
    Author: {
      id: string
      username: string
      name: string
      email: string
    }
  }[]
  Assets: {
    id: string
    url: string
    key: string
    mimeType: string
  }[]
}
