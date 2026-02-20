const ROUTE = '/api/users'

/**
 * Post a user to create it.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} id The ID of the new user
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createUser(
  endpoint: string,
  username: string,
  name: string,
  email: string
): Promise<Response> {
  return fetch(endpoint + ROUTE, {
    method: 'POST',
    body: JSON.stringify({
      username,
      name,
      email,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
