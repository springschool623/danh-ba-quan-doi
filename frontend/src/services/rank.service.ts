import { Rank } from '@/types/ranks'
import { apiUrl } from '@/lib/config'

export const getRanks = async (): Promise<Rank[]> => {
  const response = await fetch(apiUrl('/api/ranks'))
  const data = await response.json()
  return data
}

export const createRank = async (rank: Rank): Promise<Response> => {
  const response = await fetch(apiUrl('/api/ranks'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rank),
  })
  if (!response.ok) {
    throw new Error('Failed to create rank')
  }
  console.log('Thêm cấp bậc thành công!')
  return response
}

export const updateRank = async (rank: Rank): Promise<Response> => {
  const response = await fetch(apiUrl(`/api/ranks/${rank.btlhcm_cb_macb}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rank),
  })
  if (!response.ok) {
    throw new Error('Failed to update rank')
  }
  console.log('Cập nhật cấp bậc thành công!')
  return response
}
