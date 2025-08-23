import { Department } from '@/types/departments'

export const getDepartments = async (): Promise<Department[]> => {
  const response = await fetch('http://localhost:5000/api/departments')
  const data = await response.json()
  return data
}
