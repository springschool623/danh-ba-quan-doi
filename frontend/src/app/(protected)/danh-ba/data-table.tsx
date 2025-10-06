'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
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
import { useEffect, useMemo, useState } from 'react'
import { Input } from '../../../components/ui/input'
import { ArrowDownIcon, FilterIcon, Loader2, MinusIcon } from 'lucide-react'
import {
  Dialog,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  addContact,
  exportExcel,
  importContactsFromExcel,
  exportVcard,
  getContacts,
  uploadImage,
} from '@/services/contact.service'
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
import { Committee } from '@/types/committees'
import { getCommittees } from '@/services/committee.service'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import usePermission from '@/hooks/usePermission'
import { User } from '@/types/users'
import useUser from '@/hooks/useUser'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDataChange?: (newData: TData[]) => void
  selectedRegion?: string
  userRole?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  selectedRegion,
  userRole,
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
  const [globalFilter, setGlobalFilter] = useState('')
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [ranks, setRanks] = useState<Rank[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const user = useUser()
  const permissions = usePermission(user as User)
  const canAdd = permissions.includes('ADD_CONTACT')
  const canExport = permissions.includes('EXPORT_CONTACT')
  const canImport = permissions.includes('IMPORT_CONTACT')

  const [formData, setFormData] = useState({
    btlhcm_lh_hoten: '',
    btlhcm_lh_capbac: 0,
    btlhcm_lh_chucvu: 0,
    btlhcm_lh_phong: 0,
    btlhcm_lh_ban: 0,
    btlhcm_lh_donvi: 0,
    btlhcm_lh_sdt_ds: '',
    btlhcm_lh_sdt_qs: '',
    btlhcm_lh_sdt_fax: '',
    btlhcm_lh_sdt_dd: '',
    btlhcm_lh_hinhanh: '',
    btlhcm_lh_ngaytao: new Date(),
    btlhcm_lh_ngaycapnhat: new Date(),
  })

  useEffect(() => {
    let filteredData = data

    console.log('userRole', userRole)

    // User đơn vị không xem được danh bạ phòng Thủ trưởng Bộ Tư Lệnh
    if (userRole === 'User') {
      filteredData = data.filter((contact: TData) => {
        const contactData = contact as Record<string, unknown>
        return contactData.btlhcm_pb_tenpb !== 'Thủ trưởng Bộ Tư lệnh'
      })
    }
    setTableData(filteredData)
  }, [data, userRole])

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

  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = await uploadImage(file)
      setFormData({
        ...formData,
        btlhcm_lh_hinhanh: imageUrl,
      })
    }
  }

  const handleAddContact = async () => {
    console.log('formData', formData)
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
          btlhcm_lh_phong: 0,
          btlhcm_lh_ban: 0,
          btlhcm_lh_donvi: 0,
          btlhcm_lh_sdt_ds: '',
          btlhcm_lh_sdt_qs: '',
          btlhcm_lh_sdt_fax: '',
          btlhcm_lh_sdt_dd: '',
          btlhcm_lh_hinhanh: '',
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
      const response = await importContactsFromExcel(file)
      if (response.ok) {
        console.log('Import CSV thành công')
        toast.success('Nhập danh bạ thành công!', {
          duration: 2000,
          position: 'top-right',
        })
      } else {
        console.log('Import CSV thất bại')
        toast.error('Nhập danh bạ thất bại!', {
          duration: 2000,
          position: 'top-right',
        })
      }
    }
    setIsImportExportOpen(false)
    console.log('Import CSV')
  }

  const handleExportCSV = async () => {
    setIsImportExportOpen(false)
    const response = await exportExcel()
    if (response.ok) {
      console.log('Export CSV thành công')
    } else {
      console.log('Export CSV thất bại')
    }
  }

  const handleExportVCard = async () => {
    setIsImportExportOpen(false)
    const response = await exportVcard()
    if (response.ok) {
      console.log('Export VCard thành công')
    } else {
      console.log('Export VCard thất bại')
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
    const fetchCommittees = async () => {
      const committees = await getCommittees()
      setCommittees(committees)
    }
    fetchLocations()
    fetchDepartments()
    fetchPositions()
    fetchRanks()
    fetchCommittees()
  }, [])

  useEffect(() => {
    if (!isAddContactOpen) {
      setFormData({
        btlhcm_lh_hoten: '',
        btlhcm_lh_capbac: 0,
        btlhcm_lh_chucvu: 0,
        btlhcm_lh_phong: 0,
        btlhcm_lh_ban: 0,
        btlhcm_lh_donvi: 0,
        btlhcm_lh_sdt_ds: '',
        btlhcm_lh_sdt_qs: '',
        btlhcm_lh_sdt_fax: '',
        btlhcm_lh_sdt_dd: '',
        btlhcm_lh_hinhanh: '',
        btlhcm_lh_ngaytao: new Date(),
        btlhcm_lh_ngaycapnhat: new Date(),
      })
    }
  }, [isAddContactOpen])

  // Allowed option sets by selectedRegion (phường)
  const regionScopedRows = useMemo(() => {
    const rows = (tableData as unknown as Record<string, unknown>[]) || []
    if (!selectedRegion) return rows
    return rows.filter(
      (r) => (r['btlhcm_px_tenpx'] as string | undefined) === selectedRegion
    )
  }, [tableData, selectedRegion])

  const allowedRankNames = useMemo(() => {
    const s = new Set<string>()
    regionScopedRows.forEach((r) => {
      const name = r['btlhcm_cb_tencb'] as string | undefined
      if (name) s.add(name)
    })
    return s
  }, [regionScopedRows])

  const allowedPositionNames = useMemo(() => {
    const s = new Set<string>()
    regionScopedRows.forEach((r) => {
      const name = r['btlhcm_cv_tencv'] as string | undefined
      if (name) s.add(name)
    })
    return s
  }, [regionScopedRows])

  const allowedDepartmentNames = useMemo(() => {
    const s = new Set<string>()
    regionScopedRows.forEach((r) => {
      const name = r['btlhcm_pb_tenpb'] as string | undefined
      if (name) s.add(name)
    })
    return s
  }, [regionScopedRows])

  const allowedCommitteeNames = useMemo(() => {
    const s = new Set<string>()
    regionScopedRows.forEach((r) => {
      const name = r['btlhcm_ba_tenb'] as string | undefined
      if (name) s.add(name)
    })
    return s
  }, [regionScopedRows])

  const allowedUnitNames = useMemo(() => {
    const s = new Set<string>()
    regionScopedRows.forEach((r) => {
      const name = r['btlhcm_dv_tendv'] as string | undefined
      if (name) s.add(name)
    })
    return s
  }, [regionScopedRows])

  // Global filter across Họ tên and Đơn vị (OR logic)
  const nameOrUnitGlobalFilter: FilterFn<TData> = (row, _columnId, value) => {
    const query = String(value || '')
      .trim()
      .toLowerCase()
    if (!query) return true
    const r = row.original as Record<string, unknown>
    const fields = ['btlhcm_lh_hoten', 'btlhcm_dv_tendv', 'btlhcm_dv_diachi']
    return fields.some((f) =>
      String(r[f] ?? '')
        .toLowerCase()
        .includes(query)
    )
  }

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: nameOrUnitGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <>
      {/* Thao tác trên danh bạ */}
      <div className="flex items-center py-4">
        {/* Lọc danh bạ */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Lọc theo họ tên, đơn vị, địa chỉ..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          {!showFilter && (
            <Button
              variant="outline"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FilterIcon className="size-4" />
              Hiện bộ lọc
            </Button>
          )}
          {showFilter && (
            <div className="flex items-center gap-2">
              {/* Lọc theo cấp bậc */}
              <Select
                value={
                  (table
                    .getColumn('btlhcm_cb_tencb')
                    ?.getFilterValue() as string) ?? ''
                }
                onValueChange={(value) =>
                  value === '__all__'
                    ? table
                        .getColumn('btlhcm_cb_tencb')
                        ?.setFilterValue(undefined)
                    : table.getColumn('btlhcm_cb_tencb')?.setFilterValue(value)
                }
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Cấp bậc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả cấp bậc</SelectItem>
                  {ranks
                    .filter((rank) =>
                      allowedRankNames.size === 0
                        ? true
                        : allowedRankNames.has(rank.btlhcm_cb_tencb || '')
                    )
                    .map((rank) => (
                      <SelectItem
                        key={rank.btlhcm_cb_macb}
                        value={rank.btlhcm_cb_tencb || ''}
                      >
                        {rank.btlhcm_cb_tencb}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Lọc theo chức vụ */}
              <Select
                value={
                  (table
                    .getColumn('btlhcm_cv_tencv')
                    ?.getFilterValue() as string) ?? ''
                }
                onValueChange={(value) =>
                  value === '__all__'
                    ? table
                        .getColumn('btlhcm_cv_tencv')
                        ?.setFilterValue(undefined)
                    : table.getColumn('btlhcm_cv_tencv')?.setFilterValue(value)
                }
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Chức vụ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả chức vụ</SelectItem>
                  {positions
                    .filter((position) =>
                      allowedPositionNames.size === 0
                        ? true
                        : allowedPositionNames.has(
                            position.btlhcm_cv_tencv || ''
                          )
                    )
                    .map((position) => (
                      <SelectItem
                        key={position.btlhcm_cv_macv}
                        value={position.btlhcm_cv_tencv || ''}
                      >
                        {position.btlhcm_cv_tencv}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Lọc theo ban */}
              {committees.length > 0 &&
                committees.some((committee) => committee.btlhcm_ba_tenb) && (
                  <Select
                    value={
                      (table
                        .getColumn('btlhcm_ba_tenb')
                        ?.getFilterValue() as string) ?? ''
                    }
                    onValueChange={(value) =>
                      value === '__all__'
                        ? table
                            .getColumn('btlhcm_ba_tenb')
                            ?.setFilterValue(undefined)
                        : table
                            .getColumn('btlhcm_ba_tenb')
                            ?.setFilterValue(value)
                    }
                  >
                    <SelectTrigger className="min-w-[160px]">
                      <SelectValue placeholder="Ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Tất cả ban</SelectItem>
                      {committees
                        .filter((committee) => {
                          // First filter by allowed committee names from region
                          const regionFilter =
                            allowedCommitteeNames.size === 0
                              ? true
                              : allowedCommitteeNames.has(
                                  committee.btlhcm_ba_tenb || ''
                                )

                          // Hide committees from "Phòng Thủ trưởng Bộ Tư Lệnh" for Admin users
                          if (
                            userRole === 'Quản trị viên (Admin)' &&
                            committee.btlhcm_ba_maphong === 1
                          ) {
                            return false
                          }

                          // Then filter by selected department
                          const selectedDepartment = table
                            .getColumn('btlhcm_pb_tenpb')
                            ?.getFilterValue() as string

                          if (
                            !selectedDepartment ||
                            selectedDepartment === '__all__'
                          ) {
                            return regionFilter
                          }

                          // Find the department by name to get its ID
                          const department = departments.find(
                            (dept) =>
                              dept.btlhcm_pb_tenpb === selectedDepartment
                          )

                          if (!department) return regionFilter

                          // Only show committees that belong to the selected department
                          return (
                            regionFilter &&
                            committee.btlhcm_ba_maphong ===
                              department.btlhcm_pb_mapb
                          )
                        })
                        .map((committee) => (
                          <SelectItem
                            key={committee.btlhcm_ba_mab}
                            value={committee.btlhcm_ba_tenb || ''}
                          >
                            {committee.btlhcm_ba_tenb}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}

              {/* Lọc theo phòng */}
              <Select
                value={
                  (table
                    .getColumn('btlhcm_pb_tenpb')
                    ?.getFilterValue() as string) ?? ''
                }
                onValueChange={(value) =>
                  value === '__all__'
                    ? table
                        .getColumn('btlhcm_pb_tenpb')
                        ?.setFilterValue(undefined)
                    : table.getColumn('btlhcm_pb_tenpb')?.setFilterValue(value)
                }
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả phòng</SelectItem>
                  {departments
                    .filter((department) => {
                      // Filter by allowed department names from region
                      const regionFilter =
                        allowedDepartmentNames.size === 0
                          ? true
                          : allowedDepartmentNames.has(
                              department.btlhcm_pb_tenpb || ''
                            )

                      // Hide "Phòng Thủ trưởng Bộ Tư Lệnh" for Admin users
                      if (
                        userRole === 'Quản trị viên (Admin)' &&
                        department.btlhcm_pb_mapb === 1
                      ) {
                        return false
                      }

                      return regionFilter
                    })
                    .map((department) => (
                      <SelectItem
                        key={department.btlhcm_pb_mapb}
                        value={department.btlhcm_pb_tenpb || ''}
                      >
                        {department.btlhcm_pb_tenpb}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Lọc theo đơn vị */}
              <Select
                value={
                  (table
                    .getColumn('btlhcm_dv_tendv')
                    ?.getFilterValue() as string) ?? ''
                }
                onValueChange={(value) =>
                  value === '__all__'
                    ? table
                        .getColumn('btlhcm_dv_tendv')
                        ?.setFilterValue(undefined)
                    : table.getColumn('btlhcm_dv_tendv')?.setFilterValue(value)
                }
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả đơn vị</SelectItem>
                  {locations
                    .filter((location) =>
                      allowedUnitNames.size === 0
                        ? true
                        : allowedUnitNames.has(location.btlhcm_dv_tendv || '')
                    )
                    .map((location) => (
                      <SelectItem
                        key={location.btlhcm_dv_madv}
                        value={location.btlhcm_dv_tendv || ''}
                      >
                        {location.btlhcm_dv_tendv}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {showFilter && (
            <Button
              variant="outline"
              onClick={() => setShowFilter(!showFilter)}
            >
              <MinusIcon className="size-4" />
              Ẩn bộ lọc
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4 py-4 ml-auto">
          {/* Thêm liên hệ */}
          {canAdd && (
            <Button variant="edit" onClick={() => setIsAddContactOpen(true)}>
              Thêm liên hệ
            </Button>
          )}
          {/* Nhập/Xuất File */}
          {canAdd && (
            <DropdownMenu
              open={isImportExportOpen}
              onOpenChange={setIsImportExportOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span>Nhập/Xuất File</span>
                  <ArrowDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-2">
                {canImport && (
                  <Button variant="ghost" onClick={handleImportCSV}>
                    Nhập file CSV (Excel)
                  </Button>
                )}
                {canExport && (
                  <Button variant="ghost" onClick={handleExportCSV}>
                    Xuất file CSV (Excel)
                  </Button>
                )}
                {canExport && (
                  <Button variant="ghost" onClick={handleExportVCard}>
                    Xuất file VCard (VCF)
                  </Button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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

              {/* Phòng */}
              <div className="grid gap-3">
                <Label htmlFor="department">Phòng:</Label>
                <Select
                  value={
                    formData.btlhcm_lh_phong.toString() === '0'
                      ? ''
                      : formData.btlhcm_lh_phong.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_lh_phong: parseInt(value),
                      btlhcm_lh_ban: 0, // Reset ban khi phòng thay đổi
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng" />
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

              {/* Ban */}
              <div className="grid gap-3">
                <Label htmlFor="committee">Ban:</Label>
                <Select
                  value={
                    formData.btlhcm_lh_ban.toString() === '0'
                      ? ''
                      : formData.btlhcm_lh_ban.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_lh_ban: parseInt(value),
                    })
                  }}
                  disabled={
                    formData.btlhcm_lh_phong === 0 ||
                    !committees.some(
                      (committee) =>
                        committee.btlhcm_ba_maphong === formData.btlhcm_lh_phong
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        formData.btlhcm_lh_phong === 0
                          ? 'Chọn ban'
                          : !committees.some(
                              (committee) =>
                                committee.btlhcm_ba_maphong ===
                                formData.btlhcm_lh_phong
                            )
                          ? 'Phòng không có ban'
                          : 'Chọn ban'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {committees
                      .filter((committee) => {
                        // Chỉ hiển thị ban thuộc về phòng đã chọn
                        if (formData.btlhcm_lh_phong === 0) return false
                        return (
                          committee.btlhcm_ba_maphong ===
                          formData.btlhcm_lh_phong
                        )
                      })
                      .map((committee) => (
                        <SelectItem
                          key={committee.btlhcm_ba_mab}
                          value={committee.btlhcm_ba_mab?.toString() || ''}
                        >
                          {committee.btlhcm_ba_tenb}
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

              {/* Hình ảnh */}
              {/* <div className="grid gap-3">
                <Label htmlFor="image">Hình ảnh:</Label>
                <Input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleUploadImage}
                />
              </div> */}
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
              {/* Số điện thoại fax */}
              <div className="grid gap-3 w-2/3">
                <Label htmlFor="phone_fax">Số Fax:</Label>
                <Input
                  id="phone_fax"
                  name="phone_fax"
                  placeholder="0909090909"
                  value={formData.btlhcm_lh_sdt_fax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_lh_sdt_fax: e.target.value,
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
                  btlhcm_lh_phong: 0,
                  btlhcm_lh_ban: 0,
                  btlhcm_lh_donvi: 0,
                  btlhcm_lh_sdt_ds: '',
                  btlhcm_lh_sdt_qs: '',
                  btlhcm_lh_sdt_fax: '',
                  btlhcm_lh_sdt_dd: '',
                  btlhcm_lh_hinhanh: '',
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
      {/* Thêm đơn vị */}
      <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm đơn vị</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
