import { Committee } from '@/types/committees'
import { apiUrl } from '@/lib/config'

export const getCommittees = async (): Promise<Committee[]> => {
  const response = await fetch(apiUrl('/api/committees'))
  const data = await response.json()
  return data
}
