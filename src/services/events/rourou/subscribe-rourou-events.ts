const ROUTE = '/api/rourous/events'

/**
 * Subscribe to rourou events
 *
 * Sends a request to the server to subscribe to rourou events via SSE response
 *
 * @description This function is used to subscribe to rourou events. It expects for output messages to be of type RourouEvent.
 *
 * @returns {EventSource} The event source to listen to rourou events
 */
export default function subscribeRourouEvents(endpoint: string): EventSource {
  return new EventSource(endpoint + ROUTE)
}
