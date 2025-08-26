import { Position } from '@/types/positions'
import { apiUrl } from '@/lib/config'

export const getPositions = async (): Promise<Position[]> => {
  const response = await fetch(apiUrl('/api/positions'))
  const data = await response.json()
  return data
}
