'use client'
import { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { getDepartmentColumns } from './columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Department } from '@/types/departments'
import {
  getDepartments,
  createDepartment,
  updateDepartment,
} from '@/services/department.service'
import { toast } from 'sonner'

export default function DepartmentsTab() {
  const [data, setData] = useState<Department[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState<Department>({
    btlhcm_pb_tenpb: '',
    btlhcm_pb_ngaytao: new Date(),
    btlhcm_pb_ngaycapnhat: new Date(),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await getDepartments()
        setData(departments)
      } catch (error) {
        console.error('Error fetching departments:', error)
        toast.error('Lỗi khi tải dữ liệu phòng')
      }
    }
    fetchData()
  }, [])

  const handleEdit = (department: Department) => {
    setFormData(department)
    setIsEditOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      btlhcm_pb_tenpb: '',
      btlhcm_pb_ngaytao: new Date(),
      btlhcm_pb_ngaycapnhat: new Date(),
    })
    setIsAddOpen(true)
  }

  const handleSave = async () => {
    try {
      if (isAddOpen) {
        const response = await createDepartment(formData)
        if (response.ok) {
          toast.success('Thêm phòng thành công!')
          setIsAddOpen(false)
        } else {
          toast.error('Lỗi khi thêm phòng')
        }
      } else {
        const response = await updateDepartment(formData)
        if (response.ok) {
          toast.success('Cập nhật phòng thành công!')
          setIsEditOpen(false)
        } else {
          toast.error('Lỗi khi cập nhật phòng')
        }
      }

      // Refresh data
      const departments = await getDepartments()
      setData(departments)
    } catch (error) {
      console.error('Error saving department:', error)
      toast.error('Lỗi khi lưu phòng')
    }
  }

  const resetForm = () => {
    setFormData({
      btlhcm_pb_tenpb: '',
      btlhcm_pb_ngaytao: new Date(),
      btlhcm_pb_ngaycapnhat: new Date(),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Phòng</h2>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm phòng
        </Button>
      </div>

      <DataTable columns={getDepartmentColumns(handleEdit)} data={data} />

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Thêm phòng mới
            </DialogTitle>
            <DialogDescription>Thêm phòng mới vào hệ thống.</DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Tên phòng:</Label>
                <Input
                  id="name"
                  placeholder="Ví dụ: Phòng Tổ chức cán bộ"
                  value={formData.btlhcm_pb_tenpb}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_pb_tenpb: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="edit" onClick={handleSave}>
              Thêm
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Làm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chỉnh sửa phòng
            </DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin phòng trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="edit-name">Tên phòng:</Label>
                <Input
                  id="edit-name"
                  placeholder="Ví dụ: Phòng Tổ chức cán bộ"
                  value={formData.btlhcm_pb_tenpb}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_pb_tenpb: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="edit" onClick={handleSave}>
              Cập nhật
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Làm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
