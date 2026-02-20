const ROUTE = '/api/rourous'

export interface CreateRourouPayload {
  authorId: string
  postId: string
  rourouName: string
}

/**
 * Create a rourou.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {CreateRourouPayload} payload The data to create the rourou
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createRourou(
  endpoint: string,
  payload: CreateRourouPayload
): Promise<Response> {
  return fetch(endpoint + ROUTE, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
}
