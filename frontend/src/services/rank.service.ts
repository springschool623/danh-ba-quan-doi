import { Rank } from '@/types/ranks'

export const getRanks = async (): Promise<Rank[]> => {
  const response = await fetch('http://localhost:5000/api/ranks')
  const data = await response.json()
  return data
}
