import { Ward } from '@/types/wards'

export const getWards = async (): Promise<Ward[]> => {
  const response = await fetch('http://localhost:5000/api/wards')
  const data = await response.json()
  return data
}
