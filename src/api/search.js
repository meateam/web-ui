import { fetchJSON } from './utils'

export default async function search (query) {
  query = encodeURIComponent(query)

  return fetchJSON(`/api/search?q=${query}`, {})
}
