import store from '@/store'
import router from '@/router'
import { Base64 } from 'js-base64'
import { baseURL } from '@/utils/constants'

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
		}
		
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
	}
	
  return '';
}

export function parseToken () {
	const token = getCookie("kd-token");

  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('token malformed')
  }

  const data = JSON.parse(Base64.decode(parts[1]))

  if (Math.round(new Date().getTime() / 1000) > data.exp) {
    throw new Error('token expired')
  }

  const user = {
    ...data,
    locale:"en",
    lockPassword:"false",
    viewMode:"mosaic",
    perm:{
      "admin": false,
      "execute": true,
      "create": true,
      "rename": true,
      "modify": true,
      "delete": true,
      "share": true,
      "download": true
    },
    commands:[],
    iss: "File Browser",
  };

  localStorage.setItem('jwt', token)
  store.commit('setJWT', token)
  store.commit('setUser', user)
}

export async function validateLogin () {
  try {
    if (getCookie("kd-token")) {
      parseToken();
    } else {
      window.open(`/auth/login`, '_self');
    }

  } catch (_) {
    console.warn('Invalid JWT token in storage') // eslint-disable-line
  }
}

export async function renew (jwt) {
  const res = await fetch(`${baseURL}/api/renew`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + jwt,
    }
  })

  const body = await res.text()

  if (res.status === 200) {
    parseToken(body)
  } else {
    throw new Error(body)
  }
}

export async function signup (username, password) {
  const data = { username, password }

  const res = await fetch(`${baseURL}/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (res.status !== 200) {
    throw new Error(res.status)
  }
}

export function logout () {
  store.commit('setJWT', '')
  store.commit('setUser', null)
  localStorage.setItem('jwt', null)
  router.push({path: '/login'})
}
