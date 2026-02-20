import type { User } from '../../models/user/user'

const ROUTE = '/api/users'

/**
 * Fetch the user.
 *
 * Sends a GET request to the server to fetch the user.
 *
 * @returns {Promise<User>} A promise of future user data
 */
export default function fetchUser(
  endpoint: string,
  username: string
): Promise<User> {
  return fetch(endpoint + ROUTE + '/' + username, {
    method: 'GET',
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error('Failed to fetch user')
  })
}
