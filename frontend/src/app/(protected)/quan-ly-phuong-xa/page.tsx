'use client'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'
import { DataTable } from './data-table'
import { getWardColumns } from './columns'
import { useEffect, useState, Suspense } from 'react'
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

import { Ward } from '@/types/wards'
import { getWards } from '@/services/ward.service'
import { toast } from 'sonner'

import { updateWard } from '@/services/ward.service'

export default function RolePage() {
  const [data, setData] = useState<Ward[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState<Ward>({
    btlhcm_px_tenpx: '',
    btlhcm_px_mota: '',
    btlhcm_px_tinhthanh: 0,
    btlhcm_px_ngaytao: new Date(),
    btlhcm_px_ngaycapnhat: new Date(),
  })

  const [wards, setWards] = useState<Ward[]>([])

  useEffect(() => {
    const fetchWards = async () => {
      const wards = await getWards()
      setWards(wards)
    }
    fetchWards()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWards()
        setData(data)
      } catch (error) {
        console.error('Error fetching wards:', error)
      }
    }
    fetchData()
  }, [])

  const handleEdit = (ward: Ward) => {
    console.log('ward', ward)
    setFormData(ward)
    setIsEditOpen(true)
  }

  const refreshData = async () => {
    try {
      const wards = await getWards()
      setData(wards)
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  const handleSave = async () => {
    try {
      const response = await updateWard(formData)
      if (response.ok) {
        setIsEditOpen(false)
        toast.success('Cập nhật phường xã thành công!')
        setFormData({
          btlhcm_px_tenpx: '',
          btlhcm_px_mota: '',
          btlhcm_px_tinhthanh: 1,
          btlhcm_px_ngaytao: new Date(),
          btlhcm_px_ngaycapnhat: new Date(),
        })
        await refreshData()
      } else {
        console.error('Error saving ward:', response)
      }
    } catch (error) {
      console.error('Error saving ward:', error)
    }
  }

  const handleBulkDelete = async () => {
    await refreshData()
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PageBreadcrumb label="Quản lý Phường/Xã (Quản trị hệ thống)" />
      </Suspense>

      <DataTable
        columns={getWardColumns(handleEdit)}
        data={data}
        onBulkDelete={handleBulkDelete}
      />
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chỉnh sửa phường/xã
            </DialogTitle>
            <DialogDescription>
              Chỉnh sửa phường/xã trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">Thông tin phường/xã:</h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Tên đơn vị */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="name">Tên phường/xã:</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Phường/Xã 001"
                  value={formData.btlhcm_px_tenpx}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_px_tenpx: e.target.value,
                    })
                  }
                />
              </div>
              {/* Mô tả */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="description">Mô tả:</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Mô tả phường/xã"
                  value={formData.btlhcm_px_mota}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_px_mota: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="edit" onClick={handleSave}>
              Cập nhật phường/xã
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
    </>
  )
}
