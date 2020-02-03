import { fetchURL, fetchJSON, removePrefix } from './utils'
import store from '@/store'
import { baseURL } from '@/utils/constants'

import axios from 'axios'

export async function getHash(hash) {
  return fetchJSON(`/api/public/share/${hash}`)
}

export async function get(url) {
  url = removePrefix(url)
  return fetchJSON(`/api/share${url}`)
}

export async function remove(hash) {
  const res = await fetchURL(`/api/share/${hash}`, {
    method: 'DELETE'
  })

  if (res.status !== 200) {
    throw new Error(res.status)
  }
}

export async function create(id, userID, role, override = true) {
  return axios.put(`${baseURL}/api/files/${id}/permissions`,
    { userID, role, override },
    { headers: { Authorization: 'Bearer ' + store.state.jwt } });
}
