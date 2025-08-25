import { Committee } from '@/types/committees'

export const getCommittees = async (): Promise<Committee[]> => {
  const response = await fetch('http://localhost:5000/api/committees')
  const data = await response.json()
  return data
}
