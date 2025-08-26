import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

type Role = { btlhcm_vt_mavt: number; btlhcm_vt_tenvt: string }
type JwtPayload = { username: string; roles: Role[]; exp: number; iat: number }

export default function useUserRoles() {
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]

    if (!token) return

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      if (decoded.exp * 1000 < Date.now()) return
      setRoles(decoded.roles ?? [])
    } catch {}
  }, [])

  const hasRole = (roleName: string): boolean =>
    roles.some(
      (r) => r.btlhcm_vt_tenvt?.normalize('NFC') === roleName.normalize('NFC')
    )

  const hasAnyRole = (roleNames: string[]): boolean =>
    roleNames.some((name) => hasRole(name))

  const hasAllRoles = (roleNames: string[]): boolean =>
    roleNames.every((name) => hasRole(name))

  return { roles, hasRole, hasAnyRole, hasAllRoles }
}
