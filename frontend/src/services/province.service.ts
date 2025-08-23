import { Province } from '@/types/provinces'

export const getProvinces = async (): Promise<Province[]> => {
  const response = await fetch('http://localhost:5000/api/provinces')
  const data = await response.json()
  return data
}
