import { Location } from '@/types/locations'
import { apiUrl } from '@/lib/config'

export const getLocations = async (): Promise<Location[]> => {
  const response = await fetch(apiUrl('/api/locations'))
  const data = await response.json()
  return data
}
