import { Position } from '@/types/positions'

export const getPositions = async (): Promise<Position[]> => {
  const response = await fetch('http://localhost:5000/api/positions')
  const data = await response.json()
  return data
}
