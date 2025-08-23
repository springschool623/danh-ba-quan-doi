// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/danh-ba') {
    const token = request.cookies.get('token')?.value
    console.log('Token:', token)

    if (!token) {
      console.log('Chưa đăng nhập!')
      return NextResponse.redirect(new URL('/dang-nhap', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!dang-nhap|_next/static|favicon.ico|public).*)'],
}
