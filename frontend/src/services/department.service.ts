import { Department } from '@/types/departments'
import { apiUrl } from '@/lib/config'

export const getDepartments = async (): Promise<Department[]> => {
  const response = await fetch(apiUrl('/api/departments'))
  const data = await response.json()
  return data
}
