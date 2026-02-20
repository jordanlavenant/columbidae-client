const ROUTE = '/api/follows'

/**
 * Post a follow relationship.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} followerId The ID of the follower
 * @param {string} followedId The ID of the followed user
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createFollow(
  endpoint: string,
  followerId: string,
  followedId: string
): Promise<Response> {
  return fetch(endpoint + ROUTE, {
    method: 'POST',
    body: JSON.stringify({
      followerId,
      followedId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
