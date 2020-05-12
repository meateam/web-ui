import { baseURL } from '@/utils/constants'
import axios from 'axios'
import store from '@/store'

export async function searchUserByName(partialName) {
    return axios.get(
      `${baseURL}/api/delegators`,
      { headers: {Authorization: 'Bearer ' + store.state.jwt},
      params: { partial: partialName } }
    );
}