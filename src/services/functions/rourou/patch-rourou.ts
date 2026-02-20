const ROUTE = '/api/rourous'

/**
 * Patch a rourou.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} id The ID of the rourou to patch
 * @param {string} rourouName The new rourou name
 * @returns {Promise<Response>} The fetch response promise
 */
export default function patchRourou(
  endpoint: string,
  id: string,
  rourouName: string
): Promise<Response> {
  return fetch(endpoint + ROUTE + '/' + id, {
    method: 'PATCH',
    body: JSON.stringify({
      rourouName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
}
