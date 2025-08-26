import { MilitaryRegion } from '@/types/militaryRegions'
import { apiUrl } from '@/lib/config'

export const getMilitaryRegions = async (): Promise<MilitaryRegion[]> => {
  const response = await fetch(apiUrl('/api/military-regions'))
  const data = await response.json()
  return data
}
