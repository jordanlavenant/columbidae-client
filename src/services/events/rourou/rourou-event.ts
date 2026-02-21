import type { RourouUpdate } from './rourou-update'

export enum RourouEventType {
  RourouCreated = 'RourouCreated',
  RourouUpdated = 'RourouUpdated',
  RourouDeleted = 'RourouDeleted',
}

export type RourouEvent = RourouUpdate | ({ type: 'Error' } & Error)
