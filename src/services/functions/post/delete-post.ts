const ROUTE = '/api/posts'

/**
 * Delete a post.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} id The ID of the post to delete
 * @returns {Promise<Response>} The fetch response promise
 */
export default function deletePost(
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
