'use client'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'
import { DataTable } from './data-table'
import { getLocationColumns } from './columns'
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

import { Location } from '@/types/locations'
import { getLocations } from '@/services/location.service'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Ward } from '@/types/wards'
import { getWards } from '@/services/ward.service'
import { updateLocation } from '@/services/location.service'

export default function RolePage() {
  const [data, setData] = useState<Location[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [formData, setFormData] = useState<Location>({
    btlhcm_dv_tendv: '',
    btlhcm_dv_diachi: '',
    btlhcm_dv_phuong: 0,
    btlhcm_dv_tinhthanh: 0,
    btlhcm_dv_quankhu: 0,
    btlhcm_dv_ngaytao: new Date(),
    btlhcm_dv_ngaycapnhat: new Date(),
  })

  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
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
      const data = await getLocations()
      setData(data)
    }
    fetchData()
  }, [])

  const handleEdit = (location: Location) => {
    console.log('location', location)
    setFormData(location)
    setIsEditOpen(true)
  }

  const handleSave = async () => {
    try {
      const response = await updateLocation(formData)
      if (response.ok) {
        setIsEditOpen(false)
        toast.success('Cập nhật đơn vị thành công!')
        setFormData({
          btlhcm_dv_tendv: '',
          btlhcm_dv_diachi: '',
          btlhcm_dv_phuong: 0,
          btlhcm_dv_tinhthanh: 1,
          btlhcm_dv_quankhu: 7,
          btlhcm_dv_ngaytao: new Date(),
          btlhcm_dv_ngaycapnhat: new Date(),
        })
        const newLocation = await getLocations()
        setData(newLocation as Location[])
      } else {
        console.error('Error saving location:', response)
      }
    } catch (error) {
      console.error('Error saving location:', error)
    }
  }

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <PageBreadcrumb label="Quản lý Đơn vị (Quản trị hệ thống)" />
      </Suspense> */}

      <DataTable columns={getLocationColumns(handleEdit)} data={data} />
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chỉnh sửa đơn vị
            </DialogTitle>
            <DialogDescription>
              Chỉnh sửa đơn vị trong hệ thống.
            </DialogDescription>
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
                  value={formData.btlhcm_dv_tendv}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_dv_tendv: e.target.value,
                    })
                  }
                />
              </div>
              {/* Địa chỉ */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="address">Địa chỉ:</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Địa chỉ đơn vị"
                  value={formData.btlhcm_dv_diachi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      btlhcm_dv_diachi: e.target.value,
                    })
                  }
                />
              </div>
              {/* Phường xã */}
              <div className="grid gap-3 col-span-1">
                <Label htmlFor="rank">Phường xã:</Label>
                <Select
                  value={
                    formData.btlhcm_dv_phuong.toString() === '0'
                      ? ''
                      : formData.btlhcm_dv_phuong.toString()
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      btlhcm_dv_phuong: parseInt(value),
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Phường xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem
                        key={ward.btlhcm_px_mapx}
                        value={ward.btlhcm_px_mapx?.toString() || ''}
                      >
                        {ward.btlhcm_px_tenpx}
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
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  btlhcm_dv_tendv: '',
                  btlhcm_dv_diachi: '',
                  btlhcm_dv_phuong: 0,
                  btlhcm_dv_tinhthanh: 1,
                  btlhcm_dv_quankhu: 7,
                  btlhcm_dv_ngaytao: new Date(),
                  btlhcm_dv_ngaycapnhat: new Date(),
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
