const ROUTE = '/api/comments/events'

/**
 * Subscribe to comment events
 *
 * Sends a request to the server to subscribe to comment events via SSE response
 *
 * @description This function is used to subscribe to comment events. It expects for output messages to be of type CommentEvent.
 *
 * @returns {EventSource} The event source to listen to comment events
 */
export default function subscribeCommentEvents(endpoint: string): EventSource {
  return new EventSource(endpoint + ROUTE)
}
