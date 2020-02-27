import store from '@/store'
import { renew } from '@/utils/auth'
import { baseURL } from '@/utils/constants'
import { apm } from '@/utils/apm';

export async function fetchURL (url, opts) {
  opts = opts || {}
  opts.headers = opts.headers || {}

  let { headers, ...rest } = opts

	const reqUrl = `${baseURL}${url}`;
	const transaction = apm.startTransaction(`GET ${reqUrl}`, 'http');
  const res = await fetch(reqUrl, {
    headers: {
      'Authorization': 'Bearer '+ store.state.jwt,
      ...headers
    },
    ...rest
	});
	
	transaction.end();

  if (res.headers.get('X-Renew-Token') === 'true') {
    await renew(store.state.jwt)
  }

  return res
}

export async function fetchJSON (url, opts) {
  const res = await fetchURL(url, opts)

  if (res.status === 200) {
    return res.json()
  } else {
    throw new Error(res.status)
  }
}

export function removePrefix (url) {
  if (url.startsWith('/files')) {
    url = url.slice(6)
  }

  return url
}
