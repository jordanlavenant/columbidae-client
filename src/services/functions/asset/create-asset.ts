const ROUTE = '/api/assets/upload'

/**
 * Upload an asset file.
 *
 * @param {string} endpoint The endpoint URL of the API
 * @param {FormData} payload The form data containing the file and folder
 * @returns {Promise<Response>} The fetch response promise
 */
export default function createAsset(
  endpoint: string,
  payload: FormData
): Promise<Response> {
  return fetch(endpoint + ROUTE, {
    method: 'POST',
    body: payload,
    credentials: 'include',
  })
}
