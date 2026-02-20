const ROUTE = '/api/users'

export interface UpdateUserPayload {
  username?: string
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  avatarId?: string
}

/**
 * Update a user's profile information.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} userId The ID of the user to update
 * @param {UpdateUserPayload} payload The data to update
 * @returns {Promise<Response>} The fetch response promise
 */
export default function updateUser(
  endpoint: string,
  userId: string,
  payload: UpdateUserPayload
): Promise<Response> {
  return fetch(`${endpoint}${ROUTE}/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
}
