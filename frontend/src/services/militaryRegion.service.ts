import { MilitaryRegion } from '@/types/militaryRegions'

export const getMilitaryRegions = async (): Promise<MilitaryRegion[]> => {
  const response = await fetch('http://localhost:5000/api/military-regions')
  const data = await response.json()
  return data
}
