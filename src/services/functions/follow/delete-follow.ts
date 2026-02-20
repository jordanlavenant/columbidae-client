const ROUTE = '/api/follows'

/**
 * Delete a follow relationship.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} id The ID of the follow relationship to delete
 * @returns {Promise<Response>} The fetch response promise
 */
export default function deleteFollow(
  endpoint: string,
  id: string
): Promise<Response> {
  return fetch(endpoint + ROUTE + '/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
