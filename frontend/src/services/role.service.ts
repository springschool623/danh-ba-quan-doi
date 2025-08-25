import { Role } from '@/types/roles'

export const getRoles = async (): Promise<Role[]> => {
  const response = await fetch('http://localhost:5000/api/roles')
  const data = await response.json()
  return data
}
