import { fetchWithAuth } from '@/lib/apiClient'

export interface Log {
  btlhcm_log_id: number
  btlhcm_log_mand: string
  btlhcm_log_vaitro: string
  btlhcm_log_hanhdong: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' | 'READ'
  btlhcm_log_bang: string
  btlhcm_log_maid: number | null
  btlhcm_log_tenbang: string | null
  btlhcm_log_chitiet: string | null
  btlhcm_log_soluong: number
  btlhcm_log_ngaytao: string
}

export interface LogsResponse {
  logs: Log[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getLogs = async (
  page: number = 1,
  limit: number = 50,
  action?: string,
  table?: string,
  startDate?: string,
  endDate?: string,
  userId?: string
): Promise<LogsResponse> => {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('limit', limit.toString())
  if (action) params.append('action', action)
  if (table) params.append('table', table)
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)
  if (userId) params.append('userId', userId)

  const response = await fetchWithAuth(`/api/logs?${params.toString()}`)
  
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền xem logs.')
    }
    throw new Error('Lỗi khi lấy logs')
  }

  const data = await response.json()
  return data
}

export const getLogById = async (id: number): Promise<Log> => {
  const response = await fetchWithAuth(`/api/logs/${id}`)
  
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Bạn không có quyền truy cập trang này')
    }
    throw new Error('Lỗi khi lấy log')
  }

  const data = await response.json()
  return data
}

