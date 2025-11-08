import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

type WardPermission = {
  btlhcm_qtckv_maqk: number | null
  btlhcm_qtckv_matt: number | null
  btlhcm_qtckv_mapx: number
}

type JwtPayload = {
  username: string
  roles: []
  wardIds: WardPermission[]
  exp: number
  iat: number
}

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/danh-ba' ||
    request.nextUrl.pathname === '/quan-ly-nguoi-dung'
  ) {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/dang-nhap', request.url))
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      // const currentTime = Math.floor(Date.now() / 1000);

      // if (decoded.exp < currentTime) {
      //   const response = NextResponse.redirect(
      //     new URL("/dang-nhap", request.url)
      //   );
      //   response.cookies.delete("token");
      //   return response;
      // }

      // ✅ Check phường xã
      const tinhthanh = request.nextUrl.searchParams.get('tinhthanh')
      const phuongxa = request.nextUrl.searchParams.get('phuongxa')

      if (
        tinhthanh &&
        decoded.wardIds.length > 0 &&
        !decoded.wardIds[0]?.btlhcm_qtckv_matt
      ) {
        return NextResponse.redirect(
          new URL(
            `/danh-ba?phuongxa=${decoded.wardIds[0].btlhcm_qtckv_mapx}`,
            request.url
          )
        )
      }

      if (phuongxa) {
        const wardId = Number(phuongxa)

        const hasPermission = decoded.wardIds.some(
          (w) => w.btlhcm_qtckv_mapx === wardId
        )

        if (!hasPermission) {
          // 👉 Lấy phường đầu tiên mà user có quyền
          const defaultWard = decoded.wardIds[0]?.btlhcm_qtckv_mapx

          if (defaultWard) {
            return NextResponse.redirect(
              new URL(`/danh-ba?phuongxa=${defaultWard}`, request.url)
            )
          }
        }
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/dang-nhap', request.url))
      response.cookies.delete('token')
      return response
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!dang-nhap|_next/static|favicon.ico|public).*)'],
}
