import { Ward } from '@/types/wards'
import { apiUrl } from '@/lib/config'
import { User } from '@/types/users'
import { fetchWithAuth } from '@/lib/apiClient'

export const getWards = async (): Promise<Ward[]> => {
  const response = await fetch(apiUrl('/api/wards'))
  const data = await response.json()
  return data
}

export const getWardByUser = async (user: User): Promise<Ward[]> => {
  const response = await fetch(apiUrl(`/api/wards/user/${user.btlhcm_nd_mand}`))
  const data = await response.json()
  return data
}

export const addWard = async (ward: Ward): Promise<Response> => {
  const response = await fetchWithAuth('/api/wards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ward),
  })
  return response
}

export const updateWard = async (ward: Ward): Promise<Response> => {
  const response = await fetchWithAuth(`/api/wards/${ward.btlhcm_px_mapx}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ward),
  })
  if (!response.ok) {
    throw new Error('Failed to update ward')
  }
  console.log('Cập nhật phường xã thành công!')
  return response
}

export const importWardsFromExcel = async (file: File): Promise<Response> => {
  const formData = new FormData()
  formData.append('file', file) // 'file' phải trùng với tên field multer nhận ở backend

  const response = await fetchWithAuth('/api/wards/import-excel', {
    method: 'POST',
    body: formData,
  })

  // Không throw error để frontend có thể parse JSON response
  return response
}

export const setWardByUserRole = async (
  user: User,
  wardIds: string[]
): Promise<Response> => {
  const response = await fetch(
    apiUrl(`/api/wards/set-ward-by-user-role/${user.btlhcm_nd_mand}`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wards: wardIds }),
    }
  )
  if (!response.ok) {
    throw new Error('Failed to set ward by user role')
  }
  console.log('Cập nhật quyền truy cập thành công!')
  return response
}

export const deleteMultipleWards = async (
  ids: number[]
): Promise<Response> => {
  const response = await fetchWithAuth('/api/wards/bulk/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  })
  return response
}