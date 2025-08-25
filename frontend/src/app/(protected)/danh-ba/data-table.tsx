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
import { Loader2, Pencil } from 'lucide-react'
import {
  Dialog,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { addContact, getContacts } from '@/services/contact.service'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getLocations } from '@/services/location.service'
import { Location } from '@/types/locations'
import { Department } from '@/types/departments'
import { Rank } from '@/types/ranks'
import { Position } from '@/types/positions'
import { getDepartments } from '@/services/department.service'
import { getRanks } from '@/services/rank.service'
import { getPositions } from '@/services/position.service'
import { toast } from 'sonner'

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
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [ranks, setRanks] = useState<Rank[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    btlhcm_lh_hoten: '',
    btlhcm_lh_capbac: 0,
    btlhcm_lh_chucvu: 0,
    btlhcm_lh_phongban: 0,
    btlhcm_lh_donvi: 0,
    btlhcm_lh_sdt_ds: '',
    btlhcm_lh_sdt_qs: '',
    btlhcm_lh_sdt_dd: '',
    btlhcm_lh_ngaytao: new Date(),
    btlhcm_lh_ngaycapnhat: new Date(),
  })

  // Update table data when prop data changes
  useEffect(() => {
    setTableData(data)
  }, [data])

  // const handleToggleEdit = () => {
  //   if (isEditing) {
  //     // Save all changes
  //     const updatedData = tableData.map((row, index) => {
  //       const rowId = index.toString()
  //       if (editingData[rowId]) {
  //         return { ...row, ...editingData[rowId] }
  //       }
  //       return row
  //     })

  //     setTableData(updatedData)
  //     setIsEditing(false)
  //     setEditingData({})
  //     setEditingCells({})

  //     if (onDataChange) {
  //       onDataChange(updatedData)
  //     }
  //   } else {
  //     // Enter edit mode
  //     setIsEditing(true)
  //     // Initialize editing data for all rows
  //     const initialEditingData: Record<string, Record<string, unknown>> = {}
  //     tableData.forEach((row, index) => {
  //       initialEditingData[index.toString()] = row as Record<string, unknown>
  //     })
  //     setEditingData(initialEditingData)
  //     setEditingCells({})
  //   }
  // }

  const handleCellClick = (rowId: string, columnId: string) => {
    if (
      !isEditing ||
      columnId === 'select' ||
      columnId === 'actions' ||
      columnId === 'btlhcm_lh_malh'
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

  const isCellEditing = (rowId: string, columnId: string) => {
    return isEditing && editingCells[rowId]?.has(columnId)
  }

  const handleAddContact = async () => {
    try {
      const response = await addContact(formData)

      if (response.ok) {
        toast.success('Thêm danh bạ thành công!', {
          duration: 2000,
          position: 'top-right',
        })
        setIsAddContactOpen(false)

        setFormData({
          btlhcm_lh_hoten: '',
          btlhcm_lh_capbac: 0,
          btlhcm_lh_chucvu: 0,
          btlhcm_lh_phongban: 0,
          btlhcm_lh_donvi: 0,
          btlhcm_lh_sdt_ds: '',
          btlhcm_lh_sdt_qs: '',
          btlhcm_lh_sdt_dd: '',
          btlhcm_lh_ngaytao: new Date(),
          btlhcm_lh_ngaycapnhat: new Date(),
        })
        setIsLoading(true)
        const newContact = await getContacts()
        setTableData(newContact as TData[])
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

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getLocations()
      setLocations(locations)
    }
    const fetchDepartments = async () => {
      const departments = await getDepartments()
      setDepartments(departments)
    }
    const fetchRanks = async () => {
      const ranks = await getRanks()
      setRanks(ranks)
    }
    const fetchPositions = async () => {
      const positions = await getPositions()
      setPositions(positions)
    }
    fetchLocations()
    fetchDepartments()
    fetchPositions()
    fetchRanks()
  }, [])

  useEffect(() => {
    if (!isAddContactOpen) {
      setFormData({
        btlhcm_lh_hoten: '',
        btlhcm_lh_capbac: 0,
        btlhcm_lh_chucvu: 0,
        btlhcm_lh_phongban: 0,
        btlhcm_lh_donvi: 0,
        btlhcm_lh_sdt_ds: '',
        btlhcm_lh_sdt_qs: '',
        btlhcm_lh_sdt_dd: '',
        btlhcm_lh_ngaytao: new Date(),
        btlhcm_lh_ngaycapnhat: new Date(),
      })
    }
  }, [isAddContactOpen])

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
      {/* Thao tác trên danh bạ */}
      <div className="flex items-center py-4">
        {/* Lọc danh bạ */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Lọc theo họ tên..."
            value={
              (table
                .getColumn('btlhcm_lh_hoten')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('btlhcm_lh_hoten')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {/* <Button
            variant={isEditing ? 'edit' : 'outline'}
            className="ml-auto"
            onClick={handleToggleEdit}
          >
            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
            <Pencil className="size-4" />
          </Button> */}
        </div>
        {/* Thêm danh bạ */}
        <div className="flex items-center py-4 ml-auto">
          <Button variant="edit" onClick={() => setIsAddContactOpen(true)}>
            Thêm liên hệ
          </Button>
        </div>
      </div>
      {/* Hiển thị danh bạ */}
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
                        if (isEditing && columnId !== 'btlhcm_lh_malh') {
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
                            // Show clickable cell that can be clicked to edit
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
                    Không có liên hệ.
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
      {/* Dialog thêm danh bạ */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Thêm liên hệ
            </DialogTitle>
            <DialogDescription>Thêm liên hệ mới vào danh bạ.</DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">Thông tin liên hệ:</h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Họ tên */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="name">Họ tên:</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.btlhcm_lh_hoten}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_lh_hoten: e.target.value,
                    })
                  }
                />
              </div>

              {/* Cấp bậc */}
              <div className="grid gap-3 col-span-1">
                <Label htmlFor="rank">Cấp bậc:</Label>
                <Select
                  value={
                    formData.btlhcm_lh_capbac.toString() === '0'
                      ? ''
                      : formData.btlhcm_lh_capbac.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_lh_capbac: parseInt(value),
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp bậc" />
                  </SelectTrigger>
                  <SelectContent>
                    {ranks.map((rank) => (
                      <SelectItem
                        key={rank.btlhcm_cb_macb}
                        value={rank.btlhcm_cb_macb?.toString() || ''}
                      >
                        {rank.btlhcm_cb_tencb}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chức vụ */}
              <div className="grid gap-3">
                <Label htmlFor="position">Chức vụ:</Label>
                <Select
                  value={
                    formData.btlhcm_lh_chucvu.toString() === '0'
                      ? ''
                      : formData.btlhcm_lh_chucvu.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_lh_chucvu: parseInt(value),
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem
                        key={position.btlhcm_cv_macv}
                        value={position.btlhcm_cv_macv?.toString() || ''}
                      >
                        {position.btlhcm_cv_tencv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phòng ban */}
              <div className="grid gap-3">
                <Label htmlFor="department">Phòng ban:</Label>
                <Select
                  value={
                    formData.btlhcm_lh_phongban.toString() === '0'
                      ? ''
                      : formData.btlhcm_lh_phongban.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_lh_phongban: parseInt(value),
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.btlhcm_pb_mapb}
                        value={department.btlhcm_pb_mapb?.toString() || ''}
                      >
                        {department.btlhcm_pb_tenpb}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Đơn vị */}
              <div className="grid gap-3">
                <Label htmlFor="unit">Đơn vị:</Label>
                <Select
                  value={
                    formData.btlhcm_lh_donvi.toString() === '0'
                      ? ''
                      : formData.btlhcm_lh_donvi.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_lh_donvi: parseInt(value),
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem
                        key={location.btlhcm_dv_madv}
                        value={location.btlhcm_dv_madv?.toString() || ''}
                      >
                        {location.btlhcm_dv_tendv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fieldgroup Số điện thoại */}
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">Số điện thoại:</h5>
            <div className="grid gap-4">
              {/* Số điện thoại dân sự */}
              <div className="grid gap-3 w-2/3">
                <Label htmlFor="phone">SĐT dân sự:</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="0909090909"
                  value={formData.btlhcm_lh_sdt_ds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_lh_sdt_ds: e.target.value,
                    })
                  }
                />
              </div>

              {/* Số điện thoại quân sự */}
              <div className="grid gap-3 w-2/3">
                <Label htmlFor="phone_qs">SĐT quân sự:</Label>
                <Input
                  id="phone_qs"
                  name="phone_qs"
                  placeholder="0909090909"
                  value={formData.btlhcm_lh_sdt_qs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_lh_sdt_qs: e.target.value,
                    })
                  }
                />
              </div>

              {/* Số điện thoại di động */}
              <div className="grid gap-3 w-2/3">
                <Label htmlFor="phone_dd">SĐT di động:</Label>
                <Input
                  id="phone_dd"
                  name="phone_dd"
                  placeholder="0909090909"
                  value={formData.btlhcm_lh_sdt_dd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_lh_sdt_dd: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="edit" onClick={handleAddContact}>
              Thêm
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  btlhcm_lh_hoten: '',
                  btlhcm_lh_capbac: 0,
                  btlhcm_lh_chucvu: 0,
                  btlhcm_lh_phongban: 0,
                  btlhcm_lh_donvi: 0,
                  btlhcm_lh_sdt_ds: '',
                  btlhcm_lh_sdt_qs: '',
                  btlhcm_lh_sdt_dd: '',
                  btlhcm_lh_ngaytao: new Date(),
                  btlhcm_lh_ngaycapnhat: new Date(),
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
