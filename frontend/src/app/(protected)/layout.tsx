import Footer from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { NavigationBar } from '@/components/common/NavigationBar'
import { TokenMonitor } from '@/components/common/TokenMonitor'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TokenMonitor />
      <Header />
      <main className="w-[1600px] mx-auto px-4 flex-1">
        <NavigationBar />
        {children}
      </main>
      <Footer />
    </>
  )
}
