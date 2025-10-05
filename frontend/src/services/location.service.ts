import { Location } from '@/types/locations'
import { apiUrl } from '@/lib/config'

export const getLocations = async (): Promise<Location[]> => {
  const response = await fetch(apiUrl('/api/locations'))
  const data = await response.json()
  return data
}

export const addLocation = async (location: Location): Promise<Response> => {
  const response = await fetch(apiUrl('/api/locations'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(location),
  })

  console.log('response', JSON.stringify(location))
  if (!response.ok) {
    throw new Error('Failed to add location')
  }
  console.log('Thêm đơn vị thành công!')
  return response
}

export const updateLocation = async (location: Location): Promise<Response> => {
  const response = await fetch(
    apiUrl(`/api/locations/${location.btlhcm_dv_madv}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    }
  )
  if (!response.ok) {
    throw new Error('Failed to update location')
  }
  console.log('Cập nhật đơn vị thành công!')
  return response
}

export const importLocationsFromExcel = async (
  file: File
): Promise<Response> => {
  const formData = new FormData()
  formData.append('file', file) // 'file' phải trùng với tên field multer nhận ở backend

  const response = await fetch(apiUrl('/api/locations/import-excel'), {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Nhập đơn vị thất bại')
  }
  console.log('Nhập đơn vị thành công!')
  return response
}
