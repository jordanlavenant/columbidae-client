const ROUTE = '/api/rourous'

/**
 * Delete a rourou.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} id The ID of the rourou to delete
 * @returns {Promise<Response>} The fetch response promise
 */
export default function deleteRourou(
  endpoint: string,
  id: string
): Promise<Response> {
  return fetch(endpoint + ROUTE + '/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
}
