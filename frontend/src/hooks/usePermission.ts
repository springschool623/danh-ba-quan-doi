import { getUserPermissionByRole } from '@/services/role.service'
import { getWardByUser } from '@/services/ward.service'
import { Ward } from '@/types/wards'
import { User } from '@/types/users'
import { useEffect, useState } from 'react'

export default function usePermission(user: User) {
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    const fetchUserPermission = async () => {
      if (!user) return
      const userPermission = await getUserPermissionByRole(user)
      console.log('userPermission', userPermission)
      setPermissions(
        userPermission.map(
          (p: { btlhcm_qh_tenqh: string }) => p.btlhcm_qh_tenqh
        )
      )
    }
    fetchUserPermission()
  }, [user])

  return permissions
}

export function useWardPermission(user: User) {
  const [wardId, setWardId] = useState<number[]>([])
  const [wardName, setWardName] = useState<string[]>([])
  useEffect(() => {
    const fetchWard = async () => {
      if (!user) return
      const ward = await getWardByUser(user)
      setWardId(ward.map((w: Ward) => w.btlhcm_px_mapx as number))
      setWardName(ward.map((w: Ward) => w.btlhcm_px_tenpx as string))
    }
    fetchWard()
  }, [user])
  return { wardId, wardName }
}
