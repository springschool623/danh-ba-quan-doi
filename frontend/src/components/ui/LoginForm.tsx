'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { userLogin } from '@/services/login.service'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await userLogin(username, password)
    try {
      if (response.status === 200) {
        // Parse response data
        const data = await response.json()
        console.log('Response data:', data)

        // Log token nếu có
        if (data.token) {
          console.log('Token received:', data.token)
        } else {
          console.log('No token in response data')
        }

        // Kiểm tra cookie token
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find((cookie) =>
          cookie.trim().startsWith('token=')
        )
        if (tokenCookie) {
          console.log('Token in cookie:', tokenCookie.split('=')[1])
        } else {
          console.log('No token cookie found')
        }

        router.push('/danh-ba')
        toast.success('Đăng nhập thành công!', {
          duration: 3000,
          style: {
            background: 'oklch(52.7% 0.154 150.069)',
            color: '#fff',
          },
        })
      } else if (response.status === 401) {
        toast.error('Tên đăng nhập hoặc mật khẩu không chính xác!', {
          duration: 3000,
          style: {
            background: 'oklch(50.5% 0.213 27.518)',
            color: '#fff',
          },
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi khi đăng nhập! Vui lòng thử lại!')
    }
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="w-[360px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập vào hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label>Tên đăng nhập</Label>
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="edit" className="w-full">
                  Đăng nhập
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
