import { Province } from '@/types/provinces'
import { apiUrl } from '@/lib/config'

export const getProvinces = async (): Promise<Province[]> => {
  const response = await fetch(apiUrl('/api/provinces'))
  const data = await response.json()
  return data
}
