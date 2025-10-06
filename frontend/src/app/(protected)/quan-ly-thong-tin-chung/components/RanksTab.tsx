'use client'
import { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { getRankColumns } from './columns'
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
import { Rank } from '@/types/ranks'
import { getRanks, createRank, updateRank } from '@/services/rank.service'
import { toast } from 'sonner'

export default function RanksTab() {
  const [data, setData] = useState<Rank[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState<Rank>({
    btlhcm_cb_tencb: '',
    btlhcm_cb_ngaytao: new Date(),
    btlhcm_cb_ngaycapnhat: new Date(),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ranks = await getRanks()
        setData(ranks)
      } catch (error) {
        console.error('Error fetching ranks:', error)
        toast.error('Lỗi khi tải dữ liệu cấp bậc')
      }
    }
    fetchData()
  }, [])

  const handleEdit = (rank: Rank) => {
    setFormData(rank)
    setIsEditOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      btlhcm_cb_tencb: '',
      btlhcm_cb_ngaytao: new Date(),
      btlhcm_cb_ngaycapnhat: new Date(),
    })
    setIsAddOpen(true)
  }

  const handleSave = async () => {
    try {
      if (isAddOpen) {
        const response = await createRank(formData)
        if (response.ok) {
          toast.success('Thêm cấp bậc thành công!')
          setIsAddOpen(false)
        } else {
          toast.error('Lỗi khi thêm cấp bậc')
        }
      } else {
        const response = await updateRank(formData)
        if (response.ok) {
          toast.success('Cập nhật cấp bậc thành công!')
          setIsEditOpen(false)
        } else {
          toast.error('Lỗi khi cập nhật cấp bậc')
        }
      }

      // Refresh data
      const ranks = await getRanks()
      setData(ranks)
    } catch (error) {
      console.error('Error saving rank:', error)
      toast.error('Lỗi khi lưu cấp bậc')
    }
  }

  const resetForm = () => {
    setFormData({
      btlhcm_cb_macb: 0,
      btlhcm_cb_tencb: '',
      btlhcm_cb_ngaytao: new Date(),
      btlhcm_cb_ngaycapnhat: new Date(),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Cấp Bậc</h2>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm cấp bậc
        </Button>
      </div>

      <DataTable columns={getRankColumns(handleEdit)} data={data} />

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Thêm cấp bậc mới
            </DialogTitle>
            <DialogDescription>
              Thêm cấp bậc mới vào hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Tên cấp bậc:</Label>
                <Input
                  id="name"
                  placeholder="Ví dụ: Thượng tá"
                  value={formData.btlhcm_cb_tencb}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_cb_tencb: e.target.value,
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
              Chỉnh sửa cấp bậc
            </DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin cấp bậc trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="edit-name">Tên cấp bậc:</Label>
                <Input
                  id="edit-name"
                  placeholder="Ví dụ: Thượng tá"
                  value={formData.btlhcm_cb_tencb}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_cb_tencb: e.target.value,
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
