const ROUTE = '/api/comments'

export interface CreateCommentPayload {
  comment: string
  authorId: string
  postId: string
}

/**
 * Create a post.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {CreateCommentPayload} payload The data to create the post
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createComment(
  endpoint: string,
  payload: CreateCommentPayload
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
