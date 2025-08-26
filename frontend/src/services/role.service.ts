import { Role } from '@/types/roles'
import { apiUrl } from '@/lib/config'

export const getRoles = async (): Promise<Role[]> => {
  const response = await fetch(apiUrl('/api/roles'))
  const data = await response.json()
  return data
}
