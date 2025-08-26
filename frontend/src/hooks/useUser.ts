import { useEffect, useState } from 'react'
import { User } from '@/types/users'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  username: string
  password: string
  exp: number
  iat: number
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null)

  const logout = () => {
    // Clear token cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // Clear localStorage if any
    localStorage.removeItem('token')
    // Redirect to login
    window.location.href = '/dang-nhap'
  }

  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (decoded.exp < currentTime) {
        console.log('Token đã hết hạn, tự động đăng xuất')
        logout()
        return false
      }
      return true
    } catch (error) {
      console.log('Token không hợp lệ, tự động đăng xuất')
      logout()
      return false
    }
  }

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]

    if (!token) return

    // Validate token immediately
    if (!validateToken(token)) return

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      console.log('Decoded: ', decoded)
      const username = decoded.username
      const password = decoded.password
      setUser({
        btlhcm_nd_mand: username,
        btlhcm_nd_matkhau: password,
      })

      // Set up timer to check token expiration every minute
      const checkExpiration = () => {
        if (!validateToken(token)) return
      }

      const interval = setInterval(checkExpiration, 60000) // Check every minute

      // Calculate time until expiration for immediate logout
      const timeUntilExpiry = decoded.exp * 1000 - Date.now()
      if (timeUntilExpiry > 0) {
        const timeout = setTimeout(() => {
          console.log('Token đã hết hạn, tự động đăng xuất')
          logout()
        }, timeUntilExpiry)

        return () => {
          clearTimeout(timeout)
          clearInterval(interval)
        }
      } else {
        // Token already expired
        logout()
        return () => clearInterval(interval)
      }
    } catch (error) {
      console.error('Lỗi xử lý token:', error)
      logout()
    }
  }, [])

  return user
}
