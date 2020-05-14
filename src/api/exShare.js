import store from '@/store'
import { baseURL } from '@/utils/constants'

import axios from 'axios'

export async function createExShare(fileId, users, classification, info, approvers, fileName) {
  let permitReq = {users, classification, info, approvers, fileName };
  return axios.put(`${baseURL}/api/files/${fileId}/permits`,
                    permitReq,
                    { headers: { Authorization: 'Bearer ' + store.state.jwt }
                   });
  }
  