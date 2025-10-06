import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate } from '@/lib/utils'
import { Rank } from '@/types/ranks'
import { Department } from '@/types/departments'
import { Committee } from '@/types/committees'

export const getRankColumns = (
  onEdit: (rank: Rank) => void
): ColumnDef<Rank>[] => {
  const columns: ColumnDef<Rank>[] = [
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
      accessorKey: 'btlhcm_cb_macb',
      header: 'STT',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'btlhcm_cb_tencb',
      header: 'Tên cấp bậc',
      id: 'name',
    },
    {
      accessorKey: 'btlhcm_cb_ngaytao',
      header: 'Ngày tạo',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_cb_ngaytao') as string),
    },
    {
      accessorKey: 'btlhcm_cb_ngaycapnhat',
      header: 'Ngày cập nhật',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_cb_ngaycapnhat') as string),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => {
        const rank = row.original
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
              <DropdownMenuItem onClick={() => onEdit(rank)}>
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns
}

export const getDepartmentColumns = (
  onEdit: (department: Department) => void
): ColumnDef<Department>[] => {
  const columns: ColumnDef<Department>[] = [
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
      accessorKey: 'btlhcm_pb_mapb',
      header: 'STT',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'btlhcm_pb_tenpb',
      header: 'Tên phòng',
      id: 'name',
    },
    {
      accessorKey: 'btlhcm_pb_ngaytao',
      header: 'Ngày tạo',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_pb_ngaytao') as string),
    },
    {
      accessorKey: 'btlhcm_pb_ngaycapnhat',
      header: 'Ngày cập nhật',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_pb_ngaycapnhat') as string),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => {
        const department = row.original
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
              <DropdownMenuItem onClick={() => onEdit(department)}>
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns
}

export const getCommitteeColumns = (
  onEdit: (committee: Committee) => void
): ColumnDef<Committee>[] => {
  const columns: ColumnDef<Committee>[] = [
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
      accessorKey: 'btlhcm_ba_mab',
      header: 'STT',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'btlhcm_ba_tenb',
      header: 'Tên ban',
      id: 'name',
    },
    {
      accessorKey: 'btlhcm_pb_tenpb',
      header: 'Phòng',
    },
    {
      accessorKey: 'btlhcm_ba_ngaytao',
      header: 'Ngày tạo',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_ba_ngaytao') as string),
    },
    {
      accessorKey: 'btlhcm_ba_ngaycapnhat',
      header: 'Ngày cập nhật',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_ba_ngaycapnhat') as string),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => {
        const committee = row.original
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
              <DropdownMenuItem onClick={() => onEdit(committee)}>
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns
}
