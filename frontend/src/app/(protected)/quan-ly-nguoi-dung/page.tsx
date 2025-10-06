'use client'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'
import { DataTable } from './data-table'
import { getUserColumns } from './columns'
import useUserRoles from '@/hooks/useUserRoles'
import { useEffect, useState, Suspense } from 'react'
import {
  addRolesToUser,
  changeUserStatus,
  getUserRoles,
  getUsers,
  updateUser,
} from '@/services/user.service'
import { User } from '@/types/users'
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
import { toast } from 'sonner'

import { getRoles } from '@/services/role.service'
import { Role } from '@/types/roles'
import { Switch } from '@/components/ui/switch'
import {
  getWards,
  getWardByUser,
  setWardByUserRole,
} from '@/services/ward.service'
import { Ward } from '@/types/wards'

export default function RolePage() {
  const [data, setData] = useState<User[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isSetWardByUserRoleOpen, setIsSetWardByUserRoleOpen] = useState(false)
  const [formData, setFormData] = useState<User>({
    btlhcm_nd_mand: '',
    btlhcm_nd_matkhau: '',
    btlhcm_nd_trangthai: false,
    btlhcm_nd_ngaytao: new Date(),
    btlhcm_nd_ngaycapnhat: new Date(),
    btlhcm_nd_vaitro: [],
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoles, setSelectedRoles] = useState<{
    [key: string]: boolean
  }>({})
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedWards, setSelectedWards] = useState<{
    [key: string]: boolean
  }>({})
  const { hasAnyRole } = useUserRoles()
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers()
      setData(data)
      console.log('data', data)
    }
    fetchData()
  }, [])
  const handleEdit = (user: User) => {
    setFormData(user)
    setIsEditOpen(true)
  }

  const handleSave = async () => {
    try {
      const response = await updateUser(formData)
      if (response.ok) {
        setIsEditOpen(false)
        toast.success('Cập nhật mật khẩu người dùng thành công!')
        setFormData({
          btlhcm_nd_mand: '',
          btlhcm_nd_matkhau: '',
          btlhcm_nd_trangthai: false,
          btlhcm_nd_ngaytao: new Date(),
          btlhcm_nd_ngaycapnhat: new Date(),
          btlhcm_nd_vaitro: [],
        })
        const newUser = await getUsers()
        setData(newUser as User[])
      } else {
        console.error('Error saving user:', response)
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleDelete = (user: User) => {
    setFormData(user)
    setIsDeleteOpen(true)
  }
  const handleDeleteConfirm = async (user: User) => {
    try {
      const response = await changeUserStatus(user)
      if (response.ok) {
        setIsDeleteOpen(false)
        toast.success('Thay đổi trạng thái người dùng thành công!')
        const newUser = await getUsers()
        setData(newUser as User[])
      }
    } catch (error) {
      console.error('Error changing user status:', error)
    }
  }

  const handleAddRole = (user: User) => {
    setIsAddRoleOpen(true)
    setFormData(user)

    const fetchRoles = async () => {
      try {
        // Lấy toàn bộ roles
        const allRoles = await getRoles()
        setRoles(allRoles)

        // Lấy roles hiện tại của user được chọn
        const currentUserRoles = await getUserRoles(user)
        const initialSelectedRoles: { [key: string]: boolean } = {}

        allRoles.forEach((role) => {
          const roleId = role.btlhcm_vt_mavt?.toString() ?? ''
          // Kiểm tra xem role có trong danh sách roles hiện tại của user không
          initialSelectedRoles[roleId] = currentUserRoles.some(
            (userRole: Role) => userRole.btlhcm_vt_mavt?.toString() === roleId
          )
        })

        setSelectedRoles(initialSelectedRoles)
      } catch (error) {
        console.error('Error fetching roles:', error)
        toast.error('Có lỗi xảy ra khi tải danh sách vai trò!')
      }
    }

    fetchRoles()
  }

  const handleAddRolesToUser = async () => {
    console.log('Cập nhật vai trò cho người dùng: ', selectedRoles)
    try {
      // Lấy danh sách role hiện tại của người dùng
      const currentUserRoles = await getUserRoles(formData)

      // Lấy danh sách role được chọn
      const selectedRoleIds = Object.keys(selectedRoles).filter(
        (key) => selectedRoles[key]
      )

      // Lấy danh sách role cần thêm (role mới được chọn)
      const rolesToAdd = selectedRoleIds.filter(
        (roleId) =>
          !currentUserRoles.some(
            (userRole: Role) => userRole.btlhcm_vt_mavt?.toString() === roleId
          )
      )

      // Lấy danh sách role cần xóa (role hiện tại không còn được chọn)
      const rolesToRemove = currentUserRoles.filter(
        (userRole: Role) =>
          !selectedRoleIds.includes(userRole.btlhcm_vt_mavt?.toString() ?? '')
      )

      console.log('Role cần thêm:', rolesToAdd)
      console.log('Role cần xóa:', rolesToRemove)

      // Gọi API để cập nhật role cho người dùng
      const response = await addRolesToUser(formData, selectedRoleIds)

      if (response.ok) {
        setIsAddRoleOpen(false)
        toast.success('Cập nhật vai trò cho người dùng thành công!')

        // Reset selectedRoles
        setSelectedRoles({})

        // Cập nhật danh sách người dùng
        const newUser = await getUsers()
        setData(newUser as User[])
      } else {
        console.error('Error updating roles for user:', response)
        toast.error('Có lỗi xảy ra khi cập nhật vai trò!')
      }
    } catch (error) {
      console.error('Error updating roles for user:', error)
      toast.error('Có lỗi xảy ra khi cập nhật vai trò!')
    }
  }

  const handleSetWardByUserRole = (user: User) => {
    setIsSetWardByUserRoleOpen(true)
    setFormData(user)

    const fetchWardsAndUserWards = async () => {
      try {
        // Lấy toàn bộ wards
        const allWards = await getWards()
        setWards(allWards)

        // Lấy wards hiện tại của user được chọn
        const currentUserWards = await getWardByUser(user)
        const initialSelectedWards: { [key: string]: boolean } = {}

        allWards.forEach((ward) => {
          const wardId = ward.btlhcm_px_mapx?.toString() ?? ''
          // Kiểm tra xem ward có trong danh sách wards hiện tại của user không
          initialSelectedWards[wardId] = currentUserWards.some(
            (userWard: Ward) => userWard.btlhcm_px_mapx?.toString() === wardId
          )
        })

        setSelectedWards(initialSelectedWards)
      } catch (error) {
        console.error('Error fetching wards:', error)
        toast.error('Có lỗi xảy ra khi tải danh sách phường/xã!')
      }
    }

    fetchWardsAndUserWards()
  }

  const handleSetWardPermissions = async () => {
    console.log(
      'Cập nhật quyền truy cập phường/xã cho người dùng: ',
      selectedWards
    )
    try {
      // Lấy danh sách ward được chọn
      const selectedWardIds = Object.keys(selectedWards).filter(
        (key) => selectedWards[key]
      )

      console.log('Ward được chọn:', selectedWardIds)

      // Gọi API để cập nhật quyền truy cập ward cho người dùng
      const response = await setWardByUserRole(formData, selectedWardIds)

      if (response.ok) {
        setIsSetWardByUserRoleOpen(false)
        toast.success(
          'Cập nhật quyền truy cập phường/xã cho người dùng thành công!'
        )

        // Reset selectedWards
        setSelectedWards({})

        // Cập nhật danh sách người dùng
        const newUser = await getUsers()
        setData(newUser as User[])
      } else {
        console.error('Error updating ward permissions for user:', response)
        toast.error('Có lỗi xảy ra khi cập nhật quyền truy cập phường/xã!')
      }
    } catch (error) {
      console.error('Error updating ward permissions for user:', error)
      toast.error('Có lỗi xảy ra khi cập nhật quyền truy cập phường/xã!')
    }
  }

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getRoles()
      setRoles(roles)
    }
    fetchRoles()
  }, [formData])

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <PageBreadcrumb label="Quản lý Người dùng (Quản trị hệ thống)" />
      </Suspense> */}

      <DataTable
        columns={getUserColumns(
          handleEdit,
          handleDelete,
          handleAddRole,
          handleSetWardByUserRole,
          hasAnyRole([
            'Quản trị hệ thống (Super Admin)',
            'Quản trị hệ thống (Admin)',
          ])
        )}
        data={data}
      />
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Cập nhật mật khẩu người dùng
            </DialogTitle>
            <DialogDescription>Cập nhật mật khẩu người dùng.</DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">
              Thông tin người dùng:
            </h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Mã người dùng */}
              <div className="grid gap-3 col-span-2">
                <Label htmlFor="name">Mã người dùng:</Label>
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
                  disabled={true}
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
            <Button variant="edit" onClick={handleSave}>
              Cập nhật
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
                  btlhcm_nd_vaitro: [],
                })
              }}
            >
              Làm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formData.btlhcm_nd_trangthai
                ? 'Vô hiệu hóa người dùng'
                : 'Mở lại tài khoản người dùng'}
            </DialogTitle>
            <DialogDescription>
              {formData.btlhcm_nd_trangthai
                ? 'Bạn có chắc chắn muốn vô hiệu hóa người dùng này không?'
                : 'Bạn có chắc chắn muốn mở lại tài khoản cho người dùng này không?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="default" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button
              variant={formData.btlhcm_nd_trangthai ? 'destructive' : 'edit'}
              onClick={() => handleDeleteConfirm(formData)}
            >
              {formData.btlhcm_nd_trangthai
                ? 'Vô hiệu hóa người dùng'
                : 'Mở lại tài khoản'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật vai trò cho người dùng</DialogTitle>
            <DialogDescription>
              Bật/tắt các vai trò cho người dùng. Vai trò có badge &quot;Đã
              có&quot; là vai trò hiện tại của người dùng.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">Danh sách vai trò:</h5>
            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => {
                const roleId = role.btlhcm_vt_mavt?.toString() ?? ''
                const isCurrentlyAssigned = !!selectedRoles[roleId]

                return (
                  <div
                    key={role.btlhcm_vt_mavt}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Label htmlFor={roleId} className="font-medium">
                        {role.btlhcm_vt_tenvt}
                      </Label>
                      {isCurrentlyAssigned && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Đã có
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        id={roleId}
                        checked={!!selectedRoles[roleId]}
                        onCheckedChange={(checked) => {
                          setSelectedRoles((prev) => ({
                            ...prev,
                            [roleId]: checked,
                          }))
                        }}
                      />
                      <span className="text-sm text-gray-500">
                        {selectedRoles[roleId] ? 'Bật' : 'Tắt'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="default" onClick={() => setIsAddRoleOpen(false)}>
              Hủy
            </Button>
            <Button variant="edit" onClick={handleAddRolesToUser}>
              Cập nhật vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isSetWardByUserRoleOpen}
        onOpenChange={setIsSetWardByUserRoleOpen}
      >
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Cập nhật quyền truy cập theo phường/xã cho người dùng
            </DialogTitle>
            <DialogDescription>
              Bật/tắt các quyền truy cập phường/xã cho người dùng. Phường/xã có
              badge &quot;Đã có quyền&quot; là phường/xã hiện tại người dùng có
              quyền truy cập.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">Danh sách phường/xã:</h5>
            <div className="grid grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto">
              {wards.map((ward) => {
                const wardId = ward.btlhcm_px_mapx?.toString() ?? ''
                const isCurrentlyAssigned = !!selectedWards[wardId]

                return (
                  <div
                    key={ward.btlhcm_px_mapx}
                    className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Switch
                        id={`ward-${wardId}`}
                        checked={!!selectedWards[wardId]}
                        onCheckedChange={(checked) => {
                          setSelectedWards((prev) => ({
                            ...prev,
                            [wardId]: checked,
                          }))
                        }}
                      />
                      <Label
                        htmlFor={`ward-${wardId}`}
                        className="font-medium text-sm text-center"
                      >
                        {ward.btlhcm_px_tenpx}
                      </Label>
                    </div>
                    {isCurrentlyAssigned && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Đã có quyền
                      </span>
                    )}
                    <span className="text-xs text-gray-500 mt-1">
                      {selectedWards[wardId] ? 'Bật' : 'Tắt'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="default"
              onClick={() => setIsSetWardByUserRoleOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="edit" onClick={handleSetWardPermissions}>
              Cập nhật quyền truy cập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
