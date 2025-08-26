import { Ward } from '@/types/wards'
import { apiUrl } from '@/lib/config'

export const getWards = async (): Promise<Ward[]> => {
  const response = await fetch(apiUrl('/api/wards'))
  const data = await response.json()
  return data
}
