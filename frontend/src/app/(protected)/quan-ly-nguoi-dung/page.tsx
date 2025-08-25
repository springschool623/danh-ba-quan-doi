'use client'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'
import { DataTable } from './data-table'
import { getUserColumns } from './columns'
import { useUserRoles } from '@/hooks/useUserRoles'
import { useEffect, useState } from 'react'
import {
  addRolesToUser,
  disableUser,
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
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getRoles } from '@/services/role.service'
import { Role } from '@/types/roles'
import { Switch } from '@/components/ui/switch'

export default function RolePage() {
  const [data, setData] = useState<User[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
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
  const handleDataChange = (newData: User[]) => {
    setData(newData)
  }
  const handleDeleteConfirm = async (user: User) => {
    try {
      console.log('Mã người dùng: ', user)
      const response = await disableUser(user)
      if (response.ok) {
        setIsDeleteOpen(false)
        toast.success('Vô hiệu hóa người dùng thành công!')
        const newUser = await getUsers()
        setData(newUser as User[])
      }
    } catch (error) {
      console.error('Error disabling user:', error)
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

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getRoles()
      setRoles(roles)
    }
    fetchRoles()
  }, [formData])

  return (
    <>
      <PageBreadcrumb label="Quản lý Người dùng (Quản trị hệ thống)" />

      <DataTable
        columns={getUserColumns(
          handleEdit,
          handleDelete,
          handleAddRole,
          hasAnyRole([
            'Quản trị hệ thống (Super Admin)',
            'Quản trị hệ thống (Admin)',
          ])
        )}
        data={data}
        onDataChange={handleDataChange}
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
            <DialogTitle>Vô hiệu hóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn vô hiệu hóa người dùng này không?
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
              Vô hiệu hóa người dùng
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
            <Button variant="default" onClick={handleAddRolesToUser}>
              Cập nhật vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
