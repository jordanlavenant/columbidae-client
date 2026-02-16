const ROUTE = '/api/posts'

/**
 * Fetch the posts.
 *
 * Sends a GET request to the server to fetch the posts.
 *
 * @returns {Promise<[]>} A promise of future post data
 */
export default function fetchPosts(endpoint: string): Promise<[]> {
  return fetch(endpoint + ROUTE, { method: 'GET' }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error('Failed to fetch posts')
  })
}
