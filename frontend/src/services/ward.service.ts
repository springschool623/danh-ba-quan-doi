import { Ward } from '@/types/wards'
import { apiUrl } from '@/lib/config'
import { User } from '@/types/users'

export const getWards = async (): Promise<Ward[]> => {
  const response = await fetch(apiUrl('/api/wards'))
  const data = await response.json()
  return data
}

export const getWardByUser = async (user: User): Promise<Ward[]> => {
  const response = await fetch(apiUrl(`/api/wards/user/${user.btlhcm_nd_mand}`))
  const data = await response.json()
  return data
}
