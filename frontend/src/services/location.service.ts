import { Location } from '@/types/locations'

export const getLocations = async (): Promise<Location[]> => {
  const response = await fetch('http://localhost:5000/api/locations')
  const data = await response.json()
  return data
}
