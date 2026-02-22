const ROUTE = '/api/users'

export interface CreateUserPayload {
  username: string
  name: string
  email: string
  password: string
  avatarId?: string
}

/**
 * Post a user to create it.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {CreateUserPayload} payload The data to create the user
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createUser(
  endpoint: string,
  payload: CreateUserPayload
): Promise<Response> {
  return fetch(endpoint + ROUTE, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
