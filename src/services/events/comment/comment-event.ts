import type { CommentUpdate } from './comment-update'

export enum CommentEventType {
  CommentCreated = 'CommentCreated',
  CommentUpdated = 'CommentUpdated',
  CommentDeleted = 'CommentDeleted',
}

export type CommentEvent = CommentUpdate | ({ type: 'Error' } & Error)
