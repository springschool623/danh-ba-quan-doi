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
  const militaryRegion = searchParams.get('quankhu')
  const province = searchParams.get('tinhthanh')
  const ward = searchParams.get('phuongxa')
  return (
    <Breadcrumb className="pt-5 pl-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
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
        )}
        {province && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
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
