'use client'
import { DataTable } from './data-table'
import { getLogColumns } from './columns'
import useUserRoles from '@/hooks/useUserRoles'
import { useEffect, useState } from 'react'
import { getLogs, Log } from '@/services/log.service'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function LogsPage() {
  const { roles } = useUserRoles()
  const [data, setData] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)

  // Filters
  const [actionFilter, setActionFilter] = useState<string>('')
  const [tableFilter, setTableFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [userIdFilter, setUserIdFilter] = useState<string>('')

  // Debug để xem roles thực tế (chỉ để debug)
  const roleNames = roles.map((r) => r.btlhcm_vt_tenvt)
  console.log('Current user roles:', roleNames)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const response = await getLogs(
          page,
          limit,
          actionFilter || undefined,
          tableFilter || undefined,
          startDate || undefined,
          endDate || undefined,
          userIdFilter || undefined
        )
        setData(response.logs)
        setTotalPages(response.pagination.totalPages)
        setTotal(response.pagination.total)
      } catch (error) {
        console.error('Error fetching logs:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Lỗi khi tải logs'
        // Nếu là lỗi 403, hiển thị thông báo không có quyền
        if (
          errorMessage.includes('không có quyền') ||
          errorMessage.includes('403')
        ) {
          toast.error(
            'Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền xem logs.',
            {
              duration: 5000,
              position: 'top-right',
            }
          )
        } else {
          toast.error(errorMessage)
        }
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [page, limit, actionFilter, tableFilter, startDate, endDate, userIdFilter])

  const handleResetFilters = () => {
    setActionFilter('')
    setTableFilter('')
    setStartDate('')
    setEndDate('')
    setUserIdFilter('')
    setPage(1)
  }

  // Không kiểm tra quyền ở frontend, để backend xử lý
  // Nếu không có quyền, backend sẽ trả về 403 và hiển thị lỗi trong catch

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quản lý Logs</h1>
        <p className="text-muted-foreground">
          Theo dõi tất cả các thao tác CRUD của admin và user
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 border rounded-lg bg-card">
        <div className="flex flex-row gap-4">
          <div>
            <Label htmlFor="userId" className="text-sm font-medium mb-2">
              Người dùng
            </Label>
            <Input
              id="userId"
              type="text"
              placeholder="Tìm theo mã người dùng..."
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
            />
          </div>
          {/* Hành động */}
          <div>
            <Label htmlFor="action" className="text-sm font-medium mb-2">
              Hành động
            </Label>
            <Select
              value={actionFilter || undefined}
              onValueChange={(value) => setActionFilter(value || '')}
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATE">CREATE</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="IMPORT">IMPORT</SelectItem>
                <SelectItem value="EXPORT">EXPORT</SelectItem>
                {/* <SelectItem value="READ">READ</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="table" className="text-sm font-medium mb-2">
              Bảng
            </Label>
            <Select
              value={tableFilter || undefined}
              onValueChange={(value) => setTableFilter(value || '')}
            >
              <SelectTrigger id="table">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="danhbalienhe">Danh bạ liên hệ</SelectItem>
                <SelectItem value="donvi">Đơn vị</SelectItem>
                <SelectItem value="phuongxa">Phường xã</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startDate" className="text-sm font-medium mb-2">
              Từ ngày
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-sm font-medium mb-2">
              Đến ngày
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getLogColumns()}
        data={data}
        loading={loading}
        pagination={{
          page,
          pageSize: limit,
          total,
          totalPages,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
