import store from '@/store'
import { baseURL } from '@/utils/constants'

import axios from 'axios'

export async function createExShare(fileId, users, classification, info, approvers) {
  console.log('***************** SHARING! ************************');
  let permitReq = {users, classification, info, approvers};
  console.log(permitReq);
  return axios.put(`${baseURL}/api/files/${fileId}/permits`,
                    permitReq,
                    { headers: { Authorization: 'Bearer ' + store.state.jwt }
                   });
  }
  