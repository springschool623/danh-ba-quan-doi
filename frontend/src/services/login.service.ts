import { apiUrl } from '@/lib/config'

export const userLogin = async (username: string, password: string) => {
  const response = await fetch(apiUrl('/api/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  return response
}

export const userLogout = async () => {
  const response = await fetch(apiUrl('/api/login/logout'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  return response
}
