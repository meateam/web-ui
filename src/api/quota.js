import { fetchURL } from './utils'

export async function getQuota() {
  const res = await fetchURL(`/api/user/quota`, {});
  if (res.status === 200) {
    try {
      return await res.json();
    } catch(err) {
      throw new Error(err.status);
    }
  }
  else{
    throw new Error(res.status);
  }
}