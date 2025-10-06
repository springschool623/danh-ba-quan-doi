'use client'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'
import { Suspense } from 'react'
import RanksTab from './components/RanksTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DepartmentsTab from './components/DepartmentsTab'
import CommitteesTab from './components/CommitteesTab'

export default function GeneralInfoPage() {
  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <PageBreadcrumb label="Quản lý thông tin chung (Quản trị hệ thống)" />
      </Suspense> */}

      <div className="container mx-auto py-6">
        <Tabs defaultValue="ranks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ranks">Cấp Bậc</TabsTrigger>
            <TabsTrigger value="departments">Phòng</TabsTrigger>
            <TabsTrigger value="committees">Ban</TabsTrigger>
          </TabsList>

          <TabsContent value="ranks" className="mt-6">
            <RanksTab />
          </TabsContent>

          <TabsContent value="departments" className="mt-6">
            <DepartmentsTab />
          </TabsContent>

          <TabsContent value="committees" className="mt-6">
            <CommitteesTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
