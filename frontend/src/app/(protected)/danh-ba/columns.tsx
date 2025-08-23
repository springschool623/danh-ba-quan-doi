'use client'

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
import { Contact } from '@/types/contacts'

// Helper function to format date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error(error)
    return '-'
  }
}

export const columns: ColumnDef<Contact>[] = [
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
    accessorKey: 'btlhcm_lh_malh',
    header: 'STT',
  },
  {
    accessorKey: 'btlhcm_lh_hoten',
    header: 'Họ tên',
  },
  {
    accessorKey: 'btlhcm_cb_tencb',
    header: 'Cấp Bậc',
  },
  {
    accessorKey: 'btlhcm_cv_tencv',
    header: 'Chức vụ',
  },
  {
    accessorKey: 'btlhcm_pb_tenpb',
    header: 'Phòng ban',
  },
  {
    accessorKey: 'btlhcm_dv_tendv',
    header: 'Đơn vị',
  },
  {
    accessorKey: 'btlhcm_lh_sdt_ds',
    header: 'SĐT Dân sự',
  },
  {
    accessorKey: 'btlhcm_lh_sdt_qs',
    header: 'SĐT Quân sự',
  },
  {
    accessorKey: 'btlhcm_lh_sdt_dd',
    header: 'SĐT Di động',
  },
  {
    accessorKey: 'btlhcm_lh_ngaytao',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      const dateValue = row.getValue('btlhcm_lh_ngaytao') as string
      return formatDate(dateValue)
    },
  },
  {
    accessorKey: 'btlhcm_lh_ngaycapnhat',
    header: 'Ngày cập nhật',
    cell: ({ row }) => {
      const dateValue = row.getValue('btlhcm_lh_ngaycapnhat') as string
      return formatDate(dateValue)
    },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => {
      const contact = row.original

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
              onClick={() =>
                navigator.clipboard.writeText(contact.btlhcm_lh_malh)
              }
            >
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
