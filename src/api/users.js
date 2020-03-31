import { fetchURL, fetchJSON } from './utils'
import { baseURL, config } from '@/utils/constants'
import axios from 'axios'
import store from '@/store'


export async function getAll () {
  return fetchJSON(`/api/users`, {})
}

export async function get (id) {
  return fetchJSON(`/api/users/${id}`, {})
}

export async function getExternal (id) {
  const res = await fetchJSON(`/api/delegators/${id}`, {})
  res.user.firstName = res.user.first_name;
  res.user.lastName = res.user.last_name;
  res.user.fullName = res.user.full_name;
  return res;
}

export async function create (user) {
  const res = await fetchURL(`/api/users`, {
    method: 'POST',
    body: JSON.stringify({
      what: 'user',
      which: [],
      data: user
    })
  })

  if (res.status === 201) {
    return res.headers.get('Location')
  } else {
    throw new Error(res.status)
  }

}

export async function update (user, which = ['all']) {
  const res = await fetchURL(`/api/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      what: 'user',
      which: which,
      data: user
    })
  })
  
  if (res.status !== 200) {
    throw new Error(res.status)
  }
}

export async function searchUserByName(partialName) {
  return axios.get(
    `${baseURL}/api/users`,
    { headers: {Authorization: 'Bearer ' + store.state.jwt},
    params: { partial: partialName } }
  );
}

export async function remove (id) {
  const res = await fetchURL(`/api/users/${id}`, {
    method: 'DELETE'
  })

  if (res.status !== 200) {
    throw new Error(res.status)
  }
}

export function simplifyStatus(status) {
	switch (status) {
    case "REQUEST_NOT_APPROVED":
      return "denied";
    case "REQUEST_PENDING_APPROVAL":
      return "waiting for approval";
    case "FILE_ABORTED":
      return 'failed'
    case "FILE_DROPPED":
      return 'failed'
    case "FILE_TRANSFER_FAILED":
      return 'failed'
    case "FILE_INVALID_HASH":
      return 'failed';
    case "FILE_DELETED":
      return 'failed';
    case "FILE_PASSED":
      return 'passed';
    case "FILE_TRANSFER_TO_OUT_FOLDER":
      return 'passed';
    case "FILE_FIXED":
      return 'passed';
    case "FILE_FAILED_BAD_SUFFIX":
      return "bad suffix";
    default:
      return 'sending';
	}
}
