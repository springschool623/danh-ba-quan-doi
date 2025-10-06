import { apiUrl } from '@/lib/config'
import { Committee } from '@/types/committees'

export const getCommittees = async (): Promise<Committee[]> => {
  const response = await fetch(apiUrl('/api/committees'))
  const data = await response.json()
  return data
}

export const createCommittee = async (
  committee: Committee
): Promise<Response> => {
  const response = await fetch(apiUrl('/api/committees'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(committee),
  })
  if (!response.ok) {
    throw new Error('Failed to create committee')
  }
  console.log('Thêm ban thành công!')
  return response
}

export const updateCommittee = async (
  committee: Committee
): Promise<Response> => {
  const response = await fetch(
    apiUrl(`/api/committees/${committee.btlhcm_ba_mab}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(committee),
    }
  )
  if (!response.ok) {
    throw new Error('Failed to update committee')
  }
  console.log('Cập nhật ban thành công!')
  return response
}
