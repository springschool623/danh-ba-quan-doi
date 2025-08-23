import Footer from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { NavigationBar } from '@/components/common/NavigationBar'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto py-10 px-4 flex flex-col items-center justify-center flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
