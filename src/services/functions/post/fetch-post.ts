import type { Post } from '../../models/post/post'

const ROUTE = '/api/posts'

/**
 * Fetch a single post.
 *
 * Sends a GET request to the server to fetch a specific post.
 *
 * @returns {Promise<Post>} A promise of future post data
 */
export default function fetchPost(endpoint: string, id: string): Promise<Post> {
  return fetch(endpoint + ROUTE + '/' + id, {
    method: 'GET',
    credentials: 'include',
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error('Failed to fetch post')
  })
}
