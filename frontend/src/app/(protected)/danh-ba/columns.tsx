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
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

export const getContactColumns = (
  onEdit: (contact: Contact) => void,
  onDelete?: (contact: Contact) => void,
  canEdit?: boolean,
  canDelete?: boolean
): ColumnDef<Contact>[] => {
  const columns: ColumnDef<Contact>[] = [
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
      cell: ({ row }) => row.index + 1,
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
      accessorKey: 'btlhcm_ba_tenb',
      header: 'Ban',
    },
    {
      accessorKey: 'btlhcm_pb_tenpb',
      header: 'Phòng',
    },
    {
      accessorKey: 'btlhcm_dv_tendv',
      header: 'Đơn vị',
    },
    {
      accessorKey: 'btlhcm_dv_diachi',
      header: 'Địa chỉ',
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
    // {
    //   accessorKey: 'btlhcm_lh_hinhanh',
    //   header: 'Hình ảnh',
    //   cell: ({ row }) => (
    //     <Image
    //       src={
    //         (row.getValue('btlhcm_lh_hinhanh') as string) ||
    //         '/images/default-contact-img.jpg'
    //       }
    //       alt="Hình ảnh"
    //       className="rounded-full border border-green-800"
    //       width={40}
    //       height={40}
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'btlhcm_lh_ngaytao',
      header: 'Ngày tạo',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_lh_ngaytao') as string),
    },
    {
      accessorKey: 'btlhcm_lh_ngaycapnhat',
      header: 'Ngày cập nhật',
      cell: ({ row }) =>
        formatDate(row.getValue('btlhcm_lh_ngaycapnhat') as string),
    },
  ]

  if (canEdit || canDelete) {
    columns.push({
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
              {canEdit && (
                <>
                  <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(contact)}>
                    Chỉnh sửa
                  </DropdownMenuItem>
                </>
              )}
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete?.(contact)}>
                    Xóa
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}
