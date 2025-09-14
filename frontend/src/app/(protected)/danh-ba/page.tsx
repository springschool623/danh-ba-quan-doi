'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getContactColumns } from '@/app/(protected)/danh-ba/columns'
import { DataTable } from '@/app/(protected)/danh-ba/data-table'
import {
  deleteContact,
  getContacts,
  getContactsByMilitaryRegion,
  getContactsByProvince,
  getContactsByWard,
  updateContact,
} from '@/services/contact.service'
import { Contact } from '@/types/contacts'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { getRanks } from '@/services/rank.service'
import { getPositions } from '@/services/position.service'
import { getDepartments } from '@/services/department.service'
import { getLocations } from '@/services/location.service'
import { Rank } from '@/types/ranks'
import { Position } from '@/types/positions'
import { Department } from '@/types/departments'
import { Location } from '@/types/locations'
import { toast } from 'sonner'
import useUserRoles from '@/hooks/useUserRoles'
import { Committee } from '@/types/committees'
import { getCommittees } from '@/services/committee.service'
import usePermission, { useWardPermission } from '@/hooks/usePermission'
import { User } from '@/types/users'
import useUser from '@/hooks/useUser'

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  )
}

function ContactPageContent() {
  const [data, setData] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const [selectedUserWard, setSelectedUserWard] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [ranks, setRanks] = useState<Rank[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [formData, setFormData] = useState<Contact>({
    btlhcm_lh_malh: 0,
    btlhcm_lh_hoten: '',
    btlhcm_lh_capbac: 0,
    btlhcm_lh_chucvu: 0,
    btlhcm_lh_phong: 0,
    btlhcm_lh_ban: 0,
    btlhcm_lh_donvi: 0,
    btlhcm_lh_sdt_ds: '',
    btlhcm_lh_sdt_qs: '',
    btlhcm_lh_sdt_dd: '',
    btlhcm_lh_hinhanh: '',
    btlhcm_lh_ngaytao: new Date(),
    btlhcm_lh_ngaycapnhat: new Date(),
  })
  const { roles } = useUserRoles()
  const user = useUser()
  const { wardId } = useWardPermission(user as User)
  const permissions = usePermission(user as User)
  const canEdit = permissions.includes('EDIT_CONTACT')
  const canDelete = permissions.includes('DELETE_CONTACT')

  useEffect(() => {
    if (wardId) {
      setSelectedUserWard(wardId[0])
    }
  }, [wardId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const militaryRegion = searchParams.get('quankhu')
        const province = searchParams.get('tinhthanh')
        const ward = searchParams.get('phuongxa')
        setSelectedRegion(militaryRegion)
        setSelectedProvince(province)
        setSelectedWard(ward)

        if (selectedUserWard) {
          const contacts = await getContactsByWard(selectedUserWard)
          setData(contacts)
        } else {
          if (militaryRegion) {
            const contacts = await getContactsByMilitaryRegion(
              parseInt(militaryRegion)
            )
            setData(contacts)
          } else if (province) {
            const contacts = await getContactsByProvince(parseInt(province))
            setData(contacts)
          } else if (ward) {
            const contacts = await getContactsByWard(parseInt(ward))
            setData(contacts)
          } else {
            const contacts = await getContacts()
            setData(contacts)
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, selectedUserWard])

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getLocations()
      setLocations(locations)
    }
    const fetchDepartments = async () => {
      const departments = await getDepartments()
      setDepartments(departments)
    }
    const fetchCommittees = async () => {
      const committees = await getCommittees()
      setCommittees(committees)
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
    fetchCommittees()
    fetchPositions()
    fetchRanks()
  }, [])

  // Reset committee when department changes
  useEffect(() => {
    if (formData.btlhcm_lh_phong === 0) {
      setFormData((prev) => ({
        ...prev,
        btlhcm_lh_ban: 0,
      }))
    } else {
      // Check if current committee belongs to new department
      const currentCommittee = committees.find(
        (c) => c.btlhcm_ba_mab === formData.btlhcm_lh_ban
      )
      if (
        currentCommittee &&
        currentCommittee.btlhcm_ba_maphong !== formData.btlhcm_lh_phong
      ) {
        setFormData((prev) => ({
          ...prev,
          btlhcm_lh_ban: 0,
        }))
      }
    }
  }, [formData.btlhcm_lh_phong, committees, formData.btlhcm_lh_ban])

  const handleEdit = (contact: Contact) => {
    setFormData(contact)
    setIsEditOpen(true)
  }

  const handleSave = async () => {
    try {
      const response = await updateContact(formData)
      if (response.ok) {
        setIsEditOpen(false)
        toast.success('Cập nhật liên hệ thành công!')
        setFormData({
          btlhcm_lh_malh: 0,
          btlhcm_lh_hoten: '',
          btlhcm_lh_capbac: 0,
          btlhcm_lh_chucvu: 0,
          btlhcm_lh_phong: 0,
          btlhcm_lh_ban: 0,
          btlhcm_lh_donvi: 0,
          btlhcm_lh_sdt_ds: '',
          btlhcm_lh_sdt_qs: '',
          btlhcm_lh_sdt_dd: '',
          btlhcm_lh_hinhanh: '',
          btlhcm_lh_ngaytao: new Date(),
          btlhcm_lh_ngaycapnhat: new Date(),
        })
        if (selectedUserWard) {
          const contacts = await getContactsByWard(selectedUserWard)
          setData(contacts)
        } else {
          const newContact = await getContacts()
          setData(newContact as Contact[])
        }
      } else {
        console.error('Error saving contact:', response)
      }
    } catch (error) {
      console.error('Error saving contact:', error)
    }
  }

  const handleDelete = (contact: Contact) => {
    setFormData(contact)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async (contact: Contact) => {
    try {
      const response = await deleteContact(contact)
      if (response.ok) {
        setIsDeleteOpen(false)
        toast.success('Xóa liên hệ thành công!')
        if (selectedUserWard) {
          const contacts = await getContactsByWard(selectedUserWard)
          setData(contacts)
        } else {
          const newContact = await getContacts()
          setData(newContact as Contact[])
        }
        const newContact = await getContacts()
        setData(newContact as Contact[])
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const handleDataChange = async (newData: Contact[]) => {
    setData(newData)
    try {
      console.log('Data changed:', newData)
    } catch (error) {
      console.error('Error updating contact:', error)
    }
  }

  if (loading) {
    return (
      <div className="py-10">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    )
  }

  const getBreadcrumbLabel = () => {
    if (selectedRegion && data.length > 0) {
      return `Danh bạ ${data[0]?.btlhcm_qk_tenqk || selectedRegion}`
    }
    if (selectedProvince && data.length > 0) {
      return `Danh bạ Tỉnh/Thành phố: ${
        data[0]?.btlhcm_tt_tentt || selectedProvince
      }`
    }
    if (selectedWard && data.length > 0) {
      return `Danh bạ ${data[0]?.btlhcm_px_tenpx || selectedWard}`
    }
    return ''
  }

  return (
    <>
      <PageBreadcrumb label={getBreadcrumbLabel()} />
      <div className="py-5">
        {selectedRegion && data.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-800 rounded-md">
            <p className="text-green-800">
              Đang hiển thị danh bạ của{' '}
              <strong>{data[0]?.btlhcm_qk_tenqk || selectedRegion}</strong>
            </p>
          </div>
        )}
        {selectedProvince && data.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-800 rounded-md">
            <p className="text-green-800">
              Đang hiển thị danh bạ của{' '}
              <strong>
                Tỉnh/Thành phố {data[0]?.btlhcm_tt_tentt || selectedProvince}
              </strong>
            </p>
          </div>
        )}
        {selectedWard && data.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-800 rounded-md">
            <p className="text-green-800">
              Đang hiển thị danh bạ của{' '}
              <strong>{data[0]?.btlhcm_px_tenpx || selectedWard}</strong>
            </p>
          </div>
        )}
        <DataTable
          columns={getContactColumns(
            handleEdit,
            handleDelete,
            canEdit,
            canDelete
          )}
          data={data}
          onDataChange={handleDataChange}
          selectedRegion={selectedRegion || undefined}
          userRole={roles.find((role) => role.btlhcm_vt_tenvt)?.btlhcm_vt_tenvt}
        />
      </div>
      {/* Dialog Chỉnh sửa liên hệ */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chỉnh sửa liên hệ
            </DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin liên hệ.</DialogDescription>
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
              {ranks.length > 0 && (
                <div className="grid gap-3 col-span-1">
                  <Label htmlFor="rank">Cấp bậc:</Label>
                  <Select
                    value={formData.btlhcm_lh_capbac?.toString() || ''}
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
              )}

              {/* Chức vụ */}
              {positions.length > 0 && (
                <div className="grid gap-3">
                  <Label htmlFor="position">Chức vụ:</Label>
                  <Select
                    value={formData.btlhcm_lh_chucvu?.toString() || ''}
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
              )}

              {/* Phòng */}
              {departments.length > 0 && (
                <div className="grid gap-3">
                  <Label htmlFor="department">Phòng:</Label>
                  <Select
                    value={formData.btlhcm_lh_phong?.toString() || ''}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        btlhcm_lh_phong: parseInt(value),
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
              )}

              {/* Ban */}
              {committees.length > 0 && (
                <div className="grid gap-3">
                  <Label htmlFor="committee">Ban:</Label>
                  <Select
                    value={formData.btlhcm_lh_ban?.toString() || ''}
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
                          committee.btlhcm_ba_maphong ===
                          formData.btlhcm_lh_phong
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
                        .filter(
                          (committee) =>
                            formData.btlhcm_lh_phong === 0 ||
                            committee.btlhcm_ba_maphong ===
                              formData.btlhcm_lh_phong
                        )
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
              )}

              {/* Đơn vị */}
              {locations.length > 0 && (
                <div className="grid gap-3">
                  <Label htmlFor="unit">Đơn vị:</Label>
                  <Select
                    value={formData.btlhcm_lh_donvi?.toString() || ''}
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
              )}

              {/* Hình ảnh */}
              {/* <div className="grid gap-3">
                <Label htmlFor="image">Hình ảnh:</Label>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null
                    setFormData({
                      ...formData,
                      btlhcm_lh_hinhanh: file?.name || '',
                    })
                  }}
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
            <Button variant="edit" onClick={handleSave}>
              Lưu thông tin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog Xóa liên hệ */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa liên hệ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa liên hệ này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="default" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteConfirm(formData)}
            >
              Xóa liên hệ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
