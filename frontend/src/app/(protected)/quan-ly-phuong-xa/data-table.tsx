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
  FilterFn,
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
import {
  importWardsFromExcel,
  getWards,
  addWard,
  deleteMultipleWards,
} from '@/services/ward.service'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select'
import { Ward } from '@/types/wards'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onBulkDelete?: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onBulkDelete,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isEditing] = useState(false)
  const [editingData, setEditingData] = useState<
    Record<string, Record<string, unknown>>
  >({})
  const [editingCells, setEditingCells] = useState<Record<string, Set<string>>>(
    {}
  )
  const [tableData, setTableData] = useState<TData[]>(data)
  const [isAddWardOpen, setIsAddWardOpen] = useState(false)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    btlhcm_px_tenpx: '',
    btlhcm_px_mota: '',
    btlhcm_px_tinhthanh: 1,
    btlhcm_px_ngaytao: new Date(),
    btlhcm_px_ngaycapnhat: new Date(),
  })

  const [wards, setWards] = useState<Ward[]>([])

  // Custom filter function for Vietnamese text with diacritics
  const vietnameseFilter: FilterFn<TData> = (row, columnId, value) => {
    const searchValue = String(value || '').trim()
    if (!searchValue) return true

    const cellValue = String(row.getValue(columnId) || '')

    // Normalize Vietnamese text by removing diacritics for comparison
    const normalizeVietnamese = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase()
    }

    const normalizedSearch = normalizeVietnamese(searchValue)
    const normalizedCell = normalizeVietnamese(cellValue)

    return normalizedCell.includes(normalizedSearch)
  }

  useEffect(() => {
    const fetchWards = async () => {
      const wards = await getWards()
      setWards(wards)
    }
    fetchWards()
  }, [])

  // Update table data when prop data changes
  useEffect(() => {
    setTableData(data)
  }, [data])

  const handleCellClick = (rowId: string, columnId: string) => {
    if (!isEditing || columnId === 'select' || columnId === 'actions') {
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

  // Hàm mở file để chọn Excel (xlsx/csv)
  const openFile = (): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.xlsx,.xls,.csv' // giới hạn định dạng
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0] || null
        resolve(file)
      }
      input.click()
    })
  }

  const handleImportCSV = async () => {
    const file = await openFile()
    console.log('Import CSV', file)
    if (file) {
      try {
        const response = await importWardsFromExcel(file)
        let result
        try {
          result = await response.json()
        } catch (jsonError) {
          // Nếu không parse được JSON
          console.error('Lỗi parse JSON:', jsonError)
          toast.error('Lỗi khi đọc phản hồi từ server!', {
            duration: 4000,
            position: 'top-right',
          })
          return
        }

        if (response.ok && result.success !== false) {
          console.log('Import CSV thành công', result)
          const imported = result.imported || 0
          const updated = result.updated || 0
          
          let message = 'Nhập phường xã thành công! '
          if (imported > 0 && updated > 0) {
            message += `Đã nhập ${imported} phường xã mới, cập nhật ${updated} phường xã.`
          } else if (imported > 0) {
            message += `Đã nhập ${imported} phường xã.`
          } else if (updated > 0) {
            message += `Đã cập nhật ${updated} phường xã.`
          }
          
          toast.success(message, {
            duration: 3000,
            position: 'top-right',
          })
          // Refresh data
          setIsLoading(true)
          const newWards = await getWards()
          setTableData(newWards as TData[])
          setIsLoading(false)
          if (onBulkDelete) {
            onBulkDelete()
          }
        } else {
          console.log('Import CSV có lỗi', result)
          const imported = result.imported || 0
          const updated = result.updated || 0
          
          // Hiển thị thông báo lỗi tổng quan
          if (result.message) {
            toast.error(result.message, {
              duration: 5000,
              position: 'top-right',
            })
          } else if (imported > 0 || updated > 0) {
            // Nếu có một số record được import/update thành công
            let message = ''
            if (imported > 0 && updated > 0) {
              message = `Đã nhập ${imported} phường xã mới, cập nhật ${updated} phường xã. `
            } else if (imported > 0) {
              message = `Đã nhập ${imported} phường xã. `
            } else if (updated > 0) {
              message = `Đã cập nhật ${updated} phường xã. `
            }
            message += `Có một số lỗi xảy ra.`
            toast.warning(message, {
              duration: 5000,
              position: 'top-right',
            })
          }
          // Hiển thị từng lỗi chi tiết
          if (result.errors && Array.isArray(result.errors)) {
            // Hiển thị tối đa 5 lỗi đầu tiên để tránh spam toast
            const errorsToShow = result.errors.slice(0, 5)
            errorsToShow.forEach((error: string) => {
              toast.error(error, {
                duration: 4000,
                position: 'top-right',
              })
            })
            if (result.errors.length > 5) {
              toast.error(
                `... và còn ${result.errors.length - 5} lỗi khác. Vui lòng kiểm tra lại file.`,
                {
                  duration: 4000,
                  position: 'top-right',
                }
              )
            }
          } else if (result.error) {
            toast.error(result.error, {
              duration: 4000,
              position: 'top-right',
            })
          } else {
            toast.error('Nhập phường xã thất bại!', {
              duration: 2000,
              position: 'top-right',
            })
          }
          // Refresh data nếu có một số bản ghi được import
          if (result.imported && result.imported > 0) {
            setIsLoading(true)
            const newWards = await getWards()
            setTableData(newWards as TData[])
            setIsLoading(false)
            if (onBulkDelete) {
              onBulkDelete()
            }
          }
        }
      } catch (error) {
        console.error('Lỗi khi import CSV:', error)
        toast.error('Có lỗi xảy ra khi nhập phường xã!', {
          duration: 3000,
          position: 'top-right',
        })
      }
    }
    console.log('Import CSV')
  }

  const handleAddWard = async () => {
    try {
      console.log('formData', formData)
      const response = await addWard(formData)
      if (response.ok) {
        toast.success('Thêm phường xã thành công!', {
          duration: 2000,
          position: 'top-right',
        })
        setIsAddWardOpen(false)

        setFormData({
          btlhcm_px_tenpx: '',
          btlhcm_px_mota: '',
          btlhcm_px_tinhthanh: 1,
          btlhcm_px_ngaytao: new Date(),
          btlhcm_px_ngaycapnhat: new Date(),
        })
        setIsLoading(true)
        const newLocation = await getWards()
        setTableData(newLocation as TData[])
      }
    } catch (error) {
      console.error('Lỗi khi thêm đơn vị:', error)
      toast.error('Có lỗi xảy ra khi thêm đơn vị!', {
        duration: 2000,
        position: 'top-right',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phường xã để xóa', {
        duration: 2000,
        position: 'top-right',
      })
      return
    }

    const selectedIds = selectedRows.map((row) => {
      const rowData = row.original as Record<string, unknown>
      return rowData.btlhcm_px_mapx as number
    })

    try {
      setIsLoading(true)
      const response = await deleteMultipleWards(selectedIds)
      const result = await response.json()

      if (response.ok) {
        toast.success(
          result.message ||
            `Đã xóa ${selectedIds.length} phường xã thành công!`,
          {
            duration: 2000,
            position: 'top-right',
          }
        )
        setIsBulkDeleteOpen(false)
        // Reset selection
        table.resetRowSelection()
        // Call callback to refresh data
        if (onBulkDelete) {
          onBulkDelete()
        }
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi xóa phường xã', {
          duration: 2000,
          position: 'top-right',
        })
      }
    } catch (error) {
      console.error('Lỗi khi xóa nhiều phường xã:', error)
      toast.error('Có lỗi xảy ra khi xóa phường xã', {
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
    if (!isAddWardOpen) {
      setFormData({
        btlhcm_px_tenpx: '',
        btlhcm_px_mota: '',
        btlhcm_px_tinhthanh: 1,
        btlhcm_px_ngaytao: new Date(),
        btlhcm_px_ngaycapnhat: new Date(),
      })
    }
  }, [isAddWardOpen])

  // Create columns with custom filter function
  const columnsWithFilter = columns.map((column) => {
    if ('accessorKey' in column && column.accessorKey === 'btlhcm_px_tenpx') {
      return {
        ...column,
        filterFn: vietnameseFilter,
      }
    }
    return column
  })

  const table = useReactTable({
    data: tableData,
    columns: columnsWithFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      vietnamese: vietnameseFilter,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <>
      {/* Thao tác trên đơn vị */}
      <div className="flex items-center py-4">
        {/* Lọc đơn vị */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Lọc theo tên phường xã..."
            value={
              (table
                .getColumn('btlhcm_px_tenpx')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('btlhcm_px_tenpx')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        {/* Thêm phường xã */}
        <div className="flex items-center gap-2 py-4 ml-auto">
          {/* Xóa nhiều phường xã */}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsBulkDeleteOpen(true)}
            >
              Xóa ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
          <Button variant="edit" onClick={() => setIsAddWardOpen(true)}>
            Thêm phường xã
          </Button>
          <Button variant="outline" onClick={handleImportCSV}>
            Nhập file CSV (Excel)
          </Button>
        </div>
      </div>
      {/* Hiển thị phường xã */}
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
                        if (isEditing && columnId !== 'btlhcm_dv_tendv') {
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
                    Không có phường xã.
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
      {/* Dialog thêm đơn vị */}
      <Dialog open={isAddWardOpen} onOpenChange={setIsAddWardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Thêm đơn vị</DialogTitle>
            <DialogDescription>Thêm đơn vị mới vào hệ thống.</DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">Thông tin đơn vị:</h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Tên đơn vị */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="name">Tên đơn vị:</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Đơn vị 001"
                  value={formData.btlhcm_px_tenpx}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_px_tenpx: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="edit" onClick={handleAddWard}>
              Thêm
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  btlhcm_px_tenpx: '',
                  btlhcm_px_mota: '',
                  btlhcm_px_tinhthanh: 1,
                  btlhcm_px_ngaytao: new Date(),
                  btlhcm_px_ngaycapnhat: new Date(),
                })
              }}
            >
              Làm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog Xóa nhiều phường xã */}
      <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa nhiều phường xã</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa{' '}
              {table.getFilteredSelectedRowModel().rows.length} phường xã đã
              chọn không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="default"
              onClick={() => setIsBulkDeleteOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
