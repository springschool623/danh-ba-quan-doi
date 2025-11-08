import { apiUrl } from './config'

/**
 * Lấy token từ localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

/**
 * Tạo fetch request với token trong header
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken()
  const headers = new Headers(options.headers || {})
  
  // Thêm token vào header Authorization nếu có
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  // Đảm bảo credentials được gửi kèm request
  return fetch(apiUrl(url), {
    ...options,
    headers,
    credentials: 'include', // Gửi cookie nếu có
  })
}

