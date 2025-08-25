'use client'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'
import { DataTable } from './data-table'
import { getUserColumns } from './columns'
import { useUserRoles } from '@/hooks/useUserRoles'
import { useEffect, useState } from 'react'
import {
  addRolesToUser,
  disableUser,
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
  const { hasRole } = useUserRoles()
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers()
      setData(data)
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
    console.log('Thêm vai trò cho người dùng: ', user)
    setIsAddRoleOpen(true)
    setFormData(user)
  }

  const handleAddRolesToUser = async () => {
    console.log('Thêm vai trò cho người dùng: ', selectedRoles)
    try {
      const response = await addRolesToUser(
        formData,
        Object.keys(selectedRoles).filter((key) => selectedRoles[key])
      )
      if (response.ok) {
        setIsAddRoleOpen(false)
        toast.success('Thêm vai trò cho người dùng thành công!')
        const newUser = await getUsers()
        setData(newUser as User[])
      } else {
        console.error('Error adding roles to user:', response)
      }
    } catch (error) {
      console.error('Error adding roles to user:', error)
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
          hasRole('Quản trị viên')
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
            <DialogTitle>Thêm vai trò cho người dùng</DialogTitle>
          </DialogHeader>
          <div className="border-t pt-4">
            <h5 className="text-md font-semibold mb-4">Danh sách vai trò:</h5>
            <div className="grid grid-cols-2 gap-4">
              {roles.map((role) => (
                <div
                  key={role.btlhcm_vt_mavt}
                  className="flex items-center gap-5 my-4"
                >
                  <Label htmlFor={role.btlhcm_vt_mavt?.toString()}>
                    {role.btlhcm_vt_tenvt}:
                  </Label>
                  <Switch
                    id={role.btlhcm_vt_mavt?.toString() ?? ''}
                    checked={
                      !!selectedRoles[role.btlhcm_vt_mavt?.toString() ?? '']
                    }
                    onCheckedChange={(checked) => {
                      setSelectedRoles((prev) => ({
                        ...prev,
                        [role.btlhcm_vt_mavt?.toString() ?? '']: checked,
                      }))
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="default" onClick={() => setIsAddRoleOpen(false)}>
              Hủy
            </Button>
            <Button variant="default" onClick={handleAddRolesToUser}>
              Thêm vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
