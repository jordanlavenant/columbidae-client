const URL = '/api/posts/events'

/**
 * Subscribe to posts events
 *
 * Sends a request to the server to subscribe to posts events via SSE response
 *
 * @description This function is used to subscribe to posts events. It expects for output messages to be of type PostEvent.
 *
 * @returns {EventSource} The event source to listen to posts events
 */
export default function subscribePostEvents(endpoint: string): EventSource {
  console.log('Subscribing to post events at', endpoint + URL)
  return new EventSource(endpoint + URL)
}
