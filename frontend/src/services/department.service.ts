import { Department } from '@/types/departments'
import { apiUrl } from '@/lib/config'

export const getDepartments = async (): Promise<Department[]> => {
  const response = await fetch(apiUrl('/api/departments'))
  const data = await response.json()
  return data
}

export const createDepartment = async (
  department: Department
): Promise<Response> => {
  const response = await fetch(apiUrl('/api/departments'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  })
  if (!response.ok) {
    throw new Error('Failed to create department')
  }
  console.log('Thêm phòng thành công!')
  return response
}

export const updateDepartment = async (
  department: Department
): Promise<Response> => {
  const response = await fetch(
    apiUrl(`/api/departments/${department.btlhcm_pb_mapb}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(department),
    }
  )
  if (!response.ok) {
    throw new Error('Failed to update department')
  }
  console.log('Cập nhật phòng thành công!')
  return response
}
