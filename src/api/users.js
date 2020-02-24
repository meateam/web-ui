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

export async function checkIfVIP (id) {
  const vipRes = await axios.get(`${config.vipServiceUrl}/api/vips/${id}`);
  return vipRes.data.vip === true;
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
