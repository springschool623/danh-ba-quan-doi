// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// type JwtPayload = {
//   username: string
//   password: string
//   exp: number
//   iat: number
// }

export function middleware(request: NextRequest) {
  //   if (
  //     request.nextUrl.pathname === '/danh-ba' ||
  //     request.nextUrl.pathname === '/quan-ly-nguoi-dung'
  //   ) {
  //     const token = request.cookies.get('token')?.value
  //     if (!token) {
  //       console.log('Chưa đăng nhập!')
  //       return NextResponse.redirect(new URL('/dang-nhap', request.url))
  //     }
  //     try {
  //       const decoded = jwtDecode<JwtPayload>(token)
  //       const currentTime = Math.floor(Date.now() / 1000)
  //       if (decoded.exp < currentTime) {
  //         console.log('Token đã hết hạn!')
  //         // Clear expired token cookie
  //         const response = NextResponse.redirect(
  //           new URL('/dang-nhap', request.url)
  //         )
  //         response.cookies.delete('token')
  //         return response
  //       }
  //     } catch (error) {
  //       console.log('Token không hợp lệ!')
  //       const response = NextResponse.redirect(new URL('/dang-nhap', request.url))
  //       response.cookies.delete('token')
  //       return response
  //     }
  //   }
  //   return NextResponse.next()
}

export const config = {
  matcher: ['/((?!dang-nhap|_next/static|favicon.ico|public).*)'],
}
