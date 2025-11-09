import { ColumnDef } from '@tanstack/react-table'
import { Log } from '@/services/log.service'

export const getLogColumns = (): ColumnDef<Log>[] => {
  return [
    {
      accessorKey: 'btlhcm_log_id',
      header: 'ID',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'btlhcm_log_mand',
      header: 'Người dùng',
    },
    {
      accessorKey: 'btlhcm_log_vaitro',
      header: 'Vai trò',
    },
    {
      accessorKey: 'btlhcm_log_hanhdong',
      header: 'Hành động',
      cell: ({ row }) => {
        const action = row.getValue('btlhcm_log_hanhdong') as string
        const isError = action.startsWith('ERROR_')
        const baseAction = isError ? action.replace('ERROR_', '') : action

        const actionColors: Record<string, string> = {
          CREATE: 'bg-green-100 text-green-800',
          UPDATE: 'bg-blue-100 text-blue-800',
          DELETE: 'bg-red-100 text-red-800',
          IMPORT: 'bg-purple-100 text-purple-800',
          EXPORT: 'bg-yellow-100 text-yellow-800',
          READ: 'bg-gray-100 text-gray-800',
        }

        const errorColors = 'bg-red-600 text-white border-2 border-red-800'
        const normalColor =
          actionColors[baseAction] || 'bg-gray-100 text-gray-800'

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isError ? errorColors : normalColor
            }`}
            title={isError ? 'Thao tác thất bại' : 'Thao tác thành công'}
          >
            {isError ? '❌ ERROR' : baseAction}
          </span>
        )
      },
    },
    {
      accessorKey: 'btlhcm_log_bang',
      header: 'Bảng',
      cell: ({ row }) => {
        const table = row.getValue('btlhcm_log_bang') as string
        const tableNames: Record<string, string> = {
          danhbalienhe: 'Danh bạ liên hệ',
          donvi: 'Đơn vị',
          phuongxa: 'Phường xã',
        }
        return tableNames[table] || table
      },
    },
    {
      accessorKey: 'btlhcm_log_tenbang',
      header: 'Tên bản ghi',
    },
    {
      accessorKey: 'btlhcm_log_chitiet',
      header: 'Chi tiết',
      cell: ({ row }) => {
        const details = row.getValue('btlhcm_log_chitiet') as string
        const action = row.getValue('btlhcm_log_hanhdong') as string
        const isError = action.startsWith('ERROR_')

        // Kiểm tra nếu có thông tin lỗi
        const hasError = details?.includes('LỖI:')

        if (!details) {
          return <div className="max-w-md">-</div>
        }

        // Nếu là lỗi, hiển thị với màu đỏ và format đặc biệt
        if (isError || hasError) {
          const errorParts = details.split('LỖI:')
          const normalText = errorParts[0]?.trim() || ''
          let errorText = errorParts[1]?.trim() || details

          // Chỉ lấy dòng đầu tiên của error message để ngắn gọn
          errorText = errorText.split('\n')[0].trim()

          return (
            <div className="max-w-md" title={details}>
              {normalText && <div className="text-sm mb-1">{normalText}</div>}
              <div className="w-full text-sm font-semibold text-red-600 bg-red-50 px-2 py-2 rounded border border-red-200 break-words">
                ⚠️ {errorText}
              </div>
            </div>
          )
        }

        return (
          <div className="max-w-md truncate" title={details}>
            {details}
          </div>
        )
      },
    },
    {
      accessorKey: 'btlhcm_log_soluong',
      header: 'Số lượng',
      cell: ({ row }) => {
        const count = row.getValue('btlhcm_log_soluong') as number
        return count > 1 ? count : '-'
      },
    },
    {
      accessorKey: 'btlhcm_log_ngaytao',
      header: 'Thời gian',
      cell: ({ row }) => {
        const date = row.getValue('btlhcm_log_ngaytao') as string
        return new Date(date).toLocaleString('vi-VN')
      },
    },
  ]
}
