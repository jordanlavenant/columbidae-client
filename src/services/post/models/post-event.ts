import type { PostUpdate } from './post-update'

export enum PostEventType {
  PostUpdate = 'PostUpdate',
}

export type PostEvent = PostUpdate | ({ type: 'Error' } & Error)
