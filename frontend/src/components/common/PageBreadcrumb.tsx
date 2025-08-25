'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import {
  Breadcrumb,
  // BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

export function PageBreadcrumb({ label }: { label: string }) {
  const searchParams = useSearchParams()
  // const militaryRegion = searchParams.get('quankhu')
  const province = searchParams.get('tinhthanh')
  const ward = searchParams.get('phuongxa')
  return (
    <Breadcrumb className="pt-5">
      <BreadcrumbList>
        {/* <BreadcrumbItem>
          {militaryRegion ? (
            <BreadcrumbLink asChild>
              <Link href="/danh-ba">Danh bạ Cấp Quân Khu</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Danh bạ Cấp Quân Khu</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {militaryRegion && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )} */}
        <BreadcrumbItem>
          {!province && (
            <BreadcrumbLink asChild>
              <Link href="/danh-ba?tinhthanh=1">
                Danh bạ Thành phố Hồ Chí Minh
              </Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {/* {province && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )} */}
        {ward && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
