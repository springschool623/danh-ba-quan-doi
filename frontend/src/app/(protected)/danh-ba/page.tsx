'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { columns } from '@/app/(protected)/danh-ba/columns'
import { DataTable } from '@/app/(protected)/danh-ba/data-table'
import {
  getContacts,
  getContactsByMilitaryRegion,
  getContactsByProvince,
  getContactsByWard,
} from '@/services/contact.service'
import { Contact } from '@/types/contacts'
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb'

export default function ContactPage() {
  const [data, setData] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
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

    const fetchData = async () => {
      try {
        setLoading(true)

        const militaryRegion = searchParams.get('quankhu')
        const province = searchParams.get('tinhthanh')
        const ward = searchParams.get('phuongxa')
        setSelectedRegion(militaryRegion)
        setSelectedProvince(province)
        setSelectedWard(ward)

        if (militaryRegion) {
          const contacts = await getContactsByMilitaryRegion(
            parseInt(militaryRegion)
          )
          setData(contacts)
        } else if (province) {
          const contacts = await getContactsByProvince(parseInt(province))
          setData(contacts)
        } else if (ward) {
          const contacts = await getContactsByWard(parseInt(ward))
          setData(contacts)
        } else {
          const contacts = await getContacts()
          setData(contacts)
        }
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const handleDataChange = async (newData: Contact[]) => {
    setData(newData)
    try {
      console.log('Data changed:', newData)
    } catch (error) {
      console.error('Error updating contact:', error)
    }
  }

  if (loading) {
    return (
      <div className="py-10">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    )
  }

  const getBreadcrumbLabel = () => {
    if (selectedRegion && data.length > 0) {
      return `Danh bạ ${data[0]?.btlhcm_qk_tenqk || selectedRegion}`
    }
    if (selectedProvince && data.length > 0) {
      return `Danh bạ Tỉnh/Thành phố: ${
        data[0]?.btlhcm_tt_tentt || selectedProvince
      }`
    }
    if (selectedWard && data.length > 0) {
      return `Danh bạ Phường/Xã: ${data[0]?.btlhcm_px_tenpx || selectedWard}`
    }
    return ''
  }

  return (
    <>
      <PageBreadcrumb label={getBreadcrumbLabel()} />
      <div className="py-5">
        {selectedRegion && data.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-800 rounded-md">
            <p className="text-green-800">
              Đang hiển thị danh bạ của{' '}
              <strong>{data[0]?.btlhcm_qk_tenqk || selectedRegion}</strong>
            </p>
          </div>
        )}
        {selectedProvince && data.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-800 rounded-md">
            <p className="text-green-800">
              Đang hiển thị danh bạ của{' '}
              <strong>
                Tỉnh/Thành phố {data[0]?.btlhcm_tt_tentt || selectedProvince}
              </strong>
            </p>
          </div>
        )}
        {selectedWard && data.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-800 rounded-md">
            <p className="text-green-800">
              Đang hiển thị danh bạ của{' '}
              <strong>
                Phường/Xã {data[0]?.btlhcm_px_tenpx || selectedWard}
              </strong>
            </p>
          </div>
        )}
        <DataTable
          columns={columns}
          data={data}
          onDataChange={handleDataChange}
        />
      </div>
    </>
  )
}
