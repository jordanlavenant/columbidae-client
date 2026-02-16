const ROUTE = '/api/posts'

export interface CreatePostPayload {
  content: string
  authorId: string
  assetIds: string[]
}

/**
 * Create a post.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {CreatePostPayload} payload The data to create the post
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createPost(
  endpoint: string,
  payload: CreatePostPayload
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
