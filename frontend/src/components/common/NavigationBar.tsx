'use client'

import * as React from 'react'
import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useState } from 'react'
import { useEffect } from 'react'
import { MilitaryRegion } from '@/types/militaryRegions'
import { getMilitaryRegions } from '@/services/militaryRegion.service'
import { getProvinces } from '@/services/province.service'
import { getWards } from '@/services/ward.service'
import { Province } from '@/types/provinces'
import { Ward } from '@/types/wards'
import { userLogout } from '@/services/login.service'
import { useUserRoles } from '@/hooks/useUserRoles'
export function NavigationBar() {
  const [militaryRegions, setMilitaryRegions] = useState<MilitaryRegion[]>([])
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loading, setLoading] = useState(true)
  const { hasRole } = useUserRoles()
  useEffect(() => {
    const fetchMilitaryRegions = async () => {
      try {
        const militaryRegions = await getMilitaryRegions()
        setMilitaryRegions(militaryRegions)
      } catch (error) {
        console.error('Error fetching military regions:', error)
      } finally {
        setLoading(false)
      }
    }
    const fetchProvinces = async () => {
      try {
        const provinces = await getProvinces()
        setProvinces(provinces)
      } catch (error) {
        console.error('Error fetching provinces:', error)
      } finally {
        setLoading(false)
      }
    }
    const fetchWards = async () => {
      try {
        const wards = await getWards()
        setWards(wards)
      } catch (error) {
        console.error('Error fetching wards:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMilitaryRegions()
    fetchProvinces()
    fetchWards()
  }, [])

  // Kiểm tra vai trò của người dùng
  const isAdmin = hasRole('Quản trị hệ thống')

  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-200">
      {/* Navigation Menu bên trái */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* Trang chủ */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/danh-ba">Trang chủ</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* Danh bạ Cấp Quân Khu */}
          <NavigationMenuItem>
            <Link href="/danh-ba">
              <NavigationMenuTrigger>
                Danh bạ Cấp Quân Khu
              </NavigationMenuTrigger>
            </Link>
            <NavigationMenuContent className="z-50">
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {loading ? (
                  <div className="col-span-2 p-2 text-sm text-muted-foreground">
                    Đang tải dữ liệu...
                  </div>
                ) : militaryRegions.length > 0 ? (
                  militaryRegions.map((region) => (
                    <NavigationMenuLink
                      key={region.btlhcm_qk_tenqk}
                      asChild
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <Link href={`/danh-ba?quankhu=${region.btlhcm_qk_maqk}`}>
                        <div className="text-sm font-medium leading-none">
                          Danh bạ {region.btlhcm_qk_tenqk}
                        </div>
                        {region.btlhcm_qk_mota && (
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {region.btlhcm_qk_mota}
                          </p>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  ))
                ) : (
                  <div className="col-span-2 p-2 text-sm text-muted-foreground">
                    Không có dữ liệu Quân khu
                  </div>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* Danh bạ Cấp Tỉnh */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Danh bạ Cấp Tỉnh</NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {loading ? (
                  <div className="col-span-2 p-2 text-sm text-muted-foreground">
                    Đang tải dữ liệu...
                  </div>
                ) : provinces.length > 0 ? (
                  provinces.map((province) => (
                    <NavigationMenuLink
                      key={province.btlhcm_tt_matt}
                      asChild
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <Link
                        href={`/danh-ba?tinhthanh=${province.btlhcm_tt_matt}`}
                      >
                        <div className="text-sm font-medium leading-none">
                          {province.btlhcm_tt_tentt}
                        </div>
                        {province.btlhcm_tt_mota && (
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {province.btlhcm_tt_mota}
                          </p>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  ))
                ) : (
                  <div className="col-span-2 p-2 text-sm text-muted-foreground">
                    Không có dữ liệu Quân khu
                  </div>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* Danh bạ Cấp Phường */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Danh bạ Cấp Phường</NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {loading ? (
                  <div className="col-span-2 p-2 text-sm text-muted-foreground">
                    Đang tải dữ liệu...
                  </div>
                ) : wards.length > 0 ? (
                  wards.map((ward) => (
                    <NavigationMenuLink
                      key={ward.btlhcm_px_mapx}
                      asChild
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <Link href={`/danh-ba?phuongxa=${ward.btlhcm_px_mapx}`}>
                        <div className="text-sm font-medium leading-none">
                          {ward.btlhcm_px_tenpx}
                        </div>
                        {ward.btlhcm_px_mota && (
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {ward.btlhcm_px_mota}
                          </p>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  ))
                ) : (
                  <div className="col-span-2 p-2 text-sm text-muted-foreground">
                    Không có dữ liệu Quân khu
                  </div>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* Phân quyền Người dùng (Quản trị viên) */}
          {isAdmin && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/quan-ly-nguoi-dung">
                  Quản lý Người dùng (Quản trị hệ thống)
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Nút Đăng xuất bên phải */}
      <div className="flex items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href="/"
                  onClick={async (e) => {
                    e.preventDefault()
                    try {
                      await userLogout()
                      localStorage.removeItem('token')
                      window.location.href = '/dang-nhap'
                    } catch (error) {
                      console.error('Logout error:', error)
                    }
                  }}
                >
                  Đăng xuất
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}
