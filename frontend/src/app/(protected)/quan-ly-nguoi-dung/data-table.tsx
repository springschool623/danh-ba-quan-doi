'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '../../../components/ui/button'
import { useState, useEffect } from 'react'
import { Input } from '../../../components/ui/input'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { addUser, getUsers } from '@/services/user.service'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDataChange?: (newData: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDataChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editingData, setEditingData] = useState<
    Record<string, Record<string, unknown>>
  >({})
  const [editingCells, setEditingCells] = useState<Record<string, Set<string>>>(
    {}
  )
  const [tableData, setTableData] = useState<TData[]>(data)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    btlhcm_nd_mand: '',
    btlhcm_nd_matkhau: '',
    btlhcm_nd_trangthai: false,
    btlhcm_nd_ngaytao: new Date(),
    btlhcm_nd_ngaycapnhat: new Date(),
  })

  // Update table data when prop data changes
  useEffect(() => {
    setTableData(data)
  }, [data])

  const handleCellClick = (rowId: string, columnId: string) => {
    if (
      !isEditing ||
      columnId === 'select' ||
      columnId === 'actions' ||
      columnId === 'btlhcm_nd_mand'
    ) {
      return
    }

    setEditingCells((prev) => ({
      ...prev,
      [rowId]: new Set([...(prev[rowId] || []), columnId]),
    }))
  }

  const handleInputChange = (rowId: string, field: string, value: unknown) => {
    setEditingData((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }))
  }

  const handleAddUser = async () => {
    try {
      const response = await addUser(formData)
      if (response.ok) {
        toast.success('Thêm người dùng thành công!', {
          duration: 2000,
          position: 'top-right',
        })
        setIsAddUserOpen(false)

        setFormData({
          btlhcm_nd_mand: '',
          btlhcm_nd_matkhau: '',
          btlhcm_nd_trangthai: false,
          btlhcm_nd_ngaytao: new Date(),
          btlhcm_nd_ngaycapnhat: new Date(),
        })
        setIsLoading(true)
        const newUser = await getUsers()
        setTableData(newUser as TData[])
      }
    } catch (error) {
      console.error('Lỗi khi thêm danh bạ:', error)
      toast.error('Có lỗi xảy ra khi thêm danh bạ!', {
        duration: 2000,
        position: 'top-right',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isCellEditing = (rowId: string, columnId: string) => {
    return isEditing && editingCells[rowId]?.has(columnId)
  }

  useEffect(() => {
    if (!isAddUserOpen) {
      setFormData({
        btlhcm_nd_mand: '',
        btlhcm_nd_matkhau: '',
        btlhcm_nd_trangthai: false,
        btlhcm_nd_ngaytao: new Date(),
        btlhcm_nd_ngaycapnhat: new Date(),
      })
    }
  }, [isAddUserOpen])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <>
      {/* Thao tác trên người dùng */}
      <div className="flex items-center py-4">
        {/* Lọc người dùng */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Lọc theo mã người dùng..."
            value={
              (table.getColumn('btlhcm_nd_mand')?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn('btlhcm_nd_mand')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        {/* Thêm người dùng */}
        <div className="flex items-center py-4 ml-auto">
          <Button variant="edit" onClick={() => setIsAddUserOpen(true)}>
            Thêm người dùng
          </Button>
        </div>
      </div>
      {/* Hiển thị người dùng */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const rowId = row.id
                  const rowData = row.original as Record<string, unknown>

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={isEditing ? 'bg-gray-100' : ''}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const columnId = cell.column.id

                        // Skip select column for editing
                        if (columnId === 'select') {
                          return (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                        }

                        // Handle actions column - show original content when editing
                        if (columnId === 'actions') {
                          return (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                        }

                        // Handle editable fields when in edit mode
                        if (isEditing && columnId !== 'btlhcm_nd_mand') {
                          // Don't edit ID field
                          if (isCellEditing(rowId, columnId)) {
                            // Show input for clicked cell
                            return (
                              <TableCell key={cell.id}>
                                <Input
                                  value={String(
                                    editingData[rowId]?.[columnId] ||
                                      rowData[columnId] ||
                                      ''
                                  )}
                                  onChange={(e) =>
                                    handleInputChange(
                                      rowId,
                                      columnId,
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                  autoFocus
                                />
                              </TableCell>
                            )
                          } else {
                            return (
                              <TableCell
                                key={cell.id}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => handleCellClick(rowId, columnId)}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            )
                          }
                        }

                        // Regular cell rendering
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có người dùng.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Phân trang */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} trên{' '}
          {table.getFilteredRowModel().rows.length} bản ghi được chọn.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trang Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Trang Sau
        </Button>
      </div>
      {/* Dialog thêm người dùng */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Thêm người dùng
            </DialogTitle>
            <DialogDescription>
              Thêm người dùng mới vào hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">
              Thông tin người dùng:
            </h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Họ tên */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="name">Mã người dùng:</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="ND001"
                  value={formData.btlhcm_nd_mand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_nd_mand: e.target.value,
                    })
                  }
                />
              </div>
              {/* Mật khẩu */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="password">Mật khẩu:</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="123456"
                  value={formData.btlhcm_nd_matkhau}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_nd_matkhau: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="edit" onClick={handleAddUser}>
              Thêm
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  btlhcm_nd_mand: '',
                  btlhcm_nd_matkhau: '',
                  btlhcm_nd_trangthai: false,
                  btlhcm_nd_ngaytao: new Date(),
                  btlhcm_nd_ngaycapnhat: new Date(),
                })
              }}
            >
              Làm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
