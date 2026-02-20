import type { CommentUpdate } from './comment-update'

export enum CommentEventType {
  CommentUpdate = 'CommentUpdate',
}

export type CommentEvent = CommentUpdate | ({ type: 'Error' } & Error)
