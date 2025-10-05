import { Role } from '@/types/roles'
import { apiUrl } from '@/lib/config'
import { User } from '@/types/users'

export const getRoles = async (): Promise<Role[]> => {
  const response = await fetch(apiUrl('/api/roles'))
  const data = await response.json()
  return data
}

export const getUserPermissionByRole = async (user: User) => {
  const response = await fetch(apiUrl(`/api/roles/${user.btlhcm_nd_mand}`))
  const data = await response.json()
  return data
}

export const getPermissions = async () => {
  const response = await fetch(apiUrl(`/api/permissions`))
  const data = await response.json()
  return data
}
