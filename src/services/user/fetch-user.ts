const ROUTE = '/api/users'

/**
 * Fetch the user.
 *
 * Sends a GET request to the server to fetch the user.
 *
 * @returns {Promise<any>} A promise of future user data
 */
export default function fetchUser(
  endpoint: string,
  username: string
): Promise<any> {
  return fetch(endpoint + ROUTE + '/' + username, {
    method: 'GET',
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error('Failed to fetch user')
  })
}
