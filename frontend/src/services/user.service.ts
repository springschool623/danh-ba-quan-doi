import { User } from '@/types/users'

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch('http://localhost:5000/api/users')
  const data = await response.json()
  return data
}

export const addUser = async (user: User) => {
  const response = await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  if (!response.ok) {
    throw new Error('Failed to add user')
  }
  console.log('Thêm người dùng thành công!')

  return response
}

export const updateUser = async (user: User) => {
  const response = await fetch(
    `http://localhost:5000/api/users/${user.btlhcm_nd_mand}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }
  )
  if (!response.ok) {
    throw new Error('Failed to update user')
  }
  console.log('Cập nhật mật khẩu người dùng thành công!')

  return response
}

export const disableUser = async (user: User) => {
  const response = await fetch(
    `http://localhost:5000/api/users/${user.btlhcm_nd_mand}/disable`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }
  )
  if (!response.ok) {
    throw new Error('Failed to disable user')
  }
  console.log('Vô hiệu hóa người dùng thành công!')

  return response
}

export const addRolesToUser = async (user: User, roles: string[]) => {
  console.log('Thêm vai trò cho người dùng: ', user.btlhcm_nd_mand)
  const response = await fetch(
    `http://localhost:5000/api/users/${user.btlhcm_nd_mand}/add-roles`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles: roles }),
    }
  )
  if (!response.ok) {
    throw new Error('Failed to add roles to user')
  }
  console.log('Thêm vai trò cho người dùng thành công!')

  return response
}

export const getUserRoles = async (user: User) => {
  const response = await fetch(
    `http://localhost:5000/api/users/${user.btlhcm_nd_mand}/roles`
  )
  const data = await response.json()
  return data
}
