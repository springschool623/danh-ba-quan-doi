import { Rank } from '@/types/ranks'
import { apiUrl } from '@/lib/config'

export const getRanks = async (): Promise<Rank[]> => {
  const response = await fetch(apiUrl('/api/ranks'))
  const data = await response.json()
  return data
}
