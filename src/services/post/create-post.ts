const ROUTE = '/posts'

/**
 * Create a post.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {string} id The ID of the new post
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createPost(
  endpoint: string,
  title: string,
  content: string,
  authorId: string
): Promise<Response> {
  return fetch(endpoint + ROUTE, {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      authorId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
