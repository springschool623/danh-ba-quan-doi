import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate } from '@/lib/utils'
import { User } from '@/types/users'

export const getUserColumns = (
  onEdit: (user: User) => void,
  onDelete?: (user: User) => void,
  onAddRole?: (user: User) => void,
  onSetWardByUserRole?: (user: User) => void,
  hasRole?: boolean
): ColumnDef<User>[] => {
  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'btlhcm_nd_mand',
      header: 'Mã người dùng',
    },
    {
      accessorKey: 'btlhcm_nd_matkhau',
      header: 'Mật khẩu',
      cell: ({ row }) => {
        const password = row.getValue('btlhcm_nd_matkhau') as string
        return '•'.repeat(password?.length || 8)
      },
    },
    {
      accessorKey: 'btlhcm_nd_trangthai',
      header: 'Trạng thái',
      //in viền màu theo trạng thái
      cell: ({ row }) => {
        const trangthai = row.getValue('btlhcm_nd_trangthai') as boolean
        return (
          <>
            <div
              className={`w-fit rounded-md py-1 px-4 font-semibold text-white ${
                trangthai ? 'bg-green-800' : 'bg-red-800'
              }`}
            >
              {trangthai ? 'Đang hoạt động' : 'Vô hiệu hóa'}
            </div>
          </>
        )
      },
    },
    {
      accessorKey: 'btlhcm_nd_ngaytao',
      header: 'Ngày tạo',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_nd_ngaytao') as string),
    },
    {
      accessorKey: 'btlhcm_nd_ngaycapnhat',
      header: 'Ngày cập nhật',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_nd_ngaycapnhat') as string),
    },
  ]
  if (hasRole) {
    columns.push({
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  onAddRole?.(user)
                }}
              >
                Thêm vai trò cho người dùng
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onSetWardByUserRole?.(user)
                }}
              >
                Thêm quyền truy cập theo phường/xã
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(user)}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(user)}>
                {user.btlhcm_nd_trangthai ? 'Vô hiệu hóa' : 'Mở lại tài khoản'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}
