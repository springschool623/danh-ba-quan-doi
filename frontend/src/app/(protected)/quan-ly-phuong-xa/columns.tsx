import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Ward } from '@/types/wards'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

export const getWardColumns = (
  onEdit: (ward: Ward) => void
): ColumnDef<Ward>[] => {
  const columns: ColumnDef<Ward>[] = [
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
      accessorKey: 'btlhcm_px_mapx',
      header: 'Mã phường/xã',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'btlhcm_px_tenpx',
      header: 'Tên phường/xã',
    },
    {
      accessorKey: 'btlhcm_tt_tentt',
      header: 'Tỉnh/thành',
    },
    {
      accessorKey: 'btlhcm_px_ngaytao',
      header: 'Ngày tạo',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_px_ngaytao') as string),
    },
    {
      accessorKey: 'btlhcm_px_ngaycapnhat',
      header: 'Ngày cập nhật',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_px_ngaycapnhat') as string),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => {
        const ward = row.original
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
              <DropdownMenuItem onClick={() => onEdit(ward)}>
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  return columns
}
