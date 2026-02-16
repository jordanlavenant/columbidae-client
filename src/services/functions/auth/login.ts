const ROUTE = '/api/auth/login'

export interface LoginPayload {
  email: string
  password: string
}

/**
 * Post a user to create it.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {LoginPayload} payload The login payload
 * @returns {Promise<Response>} The fetch response promise
 */
export default function login(
  endpoint: string,
  payload: LoginPayload
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
