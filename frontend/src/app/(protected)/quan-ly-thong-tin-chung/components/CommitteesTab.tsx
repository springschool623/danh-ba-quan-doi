'use client'
import { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { getCommitteeColumns } from './columns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { Committee } from '@/types/committees'
import { Department } from '@/types/departments'
import {
  getCommittees,
  createCommittee,
  updateCommittee,
} from '@/services/committee.service'
import { getDepartments } from '@/services/department.service'
import { toast } from 'sonner'

export default function CommitteesTab() {
  const [data, setData] = useState<Committee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState<Committee>({
    btlhcm_ba_tenb: '',
    btlhcm_ba_maphong: 0,
    btlhcm_ba_ngaytao: new Date(),
    btlhcm_ba_ngaycapnhat: new Date(),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [committees, departmentsData] = await Promise.all([
          getCommittees(),
          getDepartments(),
        ])
        setData(committees)
        setDepartments(departmentsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Lỗi khi tải dữ liệu')
      }
    }
    fetchData()
  }, [])

  const handleEdit = (committee: Committee) => {
    setFormData(committee)
    setIsEditOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      btlhcm_ba_tenb: '',
      btlhcm_ba_maphong: 0,
      btlhcm_ba_ngaytao: new Date(),
      btlhcm_ba_ngaycapnhat: new Date(),
    })
    setIsAddOpen(true)
  }

  const handleSave = async () => {
    try {
      if (isAddOpen) {
        const response = await createCommittee(formData)
        if (response.ok) {
          toast.success('Thêm ban thành công!')
          setIsAddOpen(false)
        } else {
          toast.error('Lỗi khi thêm ban')
        }
      } else {
        const response = await updateCommittee(formData)
        if (response.ok) {
          toast.success('Cập nhật ban thành công!')
          setIsEditOpen(false)
        } else {
          toast.error('Lỗi khi cập nhật ban')
        }
      }

      // Refresh data
      const committees = await getCommittees()
      setData(committees)
    } catch (error) {
      console.error('Error saving committee:', error)
      toast.error('Lỗi khi lưu ban')
    }
  }

  const resetForm = () => {
    setFormData({
      btlhcm_ba_tenb: '',
      btlhcm_ba_maphong: 0,
      btlhcm_ba_ngaytao: new Date(),
      btlhcm_ba_ngaycapnhat: new Date(),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Ban</h2>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm ban
        </Button>
      </div>

      <DataTable columns={getCommitteeColumns(handleEdit)} data={data} />

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Thêm ban mới
            </DialogTitle>
            <DialogDescription>Thêm ban mới vào hệ thống.</DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Tên ban:</Label>
                <Input
                  id="name"
                  placeholder="Ví dụ: Ban Tài chính"
                  value={formData.btlhcm_ba_tenb}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_ba_tenb: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="department">Phòng:</Label>
                <Select
                  value={
                    formData.btlhcm_ba_maphong.toString() === '0'
                      ? ''
                      : formData.btlhcm_ba_maphong.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_ba_maphong: parseInt(value),
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
              Chỉnh sửa ban
            </DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin ban trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="edit-name">Tên ban:</Label>
                <Input
                  id="edit-name"
                  placeholder="Ví dụ: Ban Tài chính"
                  value={formData.btlhcm_ba_tenb}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_ba_tenb: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-department">Phòng:</Label>
                <Select
                  value={
                    formData.btlhcm_ba_maphong.toString() === '0'
                      ? ''
                      : formData.btlhcm_ba_maphong.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_ba_maphong: parseInt(value),
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
