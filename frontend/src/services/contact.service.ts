import { Contact } from '@/types/contacts'
import { apiUrl } from '@/lib/config'

export const getContacts = async (): Promise<Contact[]> => {
  const response = await fetch(apiUrl('/api/contacts'))
  const data = await response.json()
  return data
}

export const getContactsByMilitaryRegion = async (
  militaryRegionId: number
): Promise<Contact[]> => {
  const response = await fetch(
    apiUrl(`/api/contacts/military-region?region=${militaryRegionId}`)
  )
  const data = await response.json()
  return data
}

export const getContactsByProvince = async (
  provinceId: number
): Promise<Contact[]> => {
  const response = await fetch(
    apiUrl(`/api/contacts/province?province=${provinceId}`)
  )
  const data = await response.json()
  return data
}

export const getContactsByWard = async (wardId: number): Promise<Contact[]> => {
  const response = await fetch(apiUrl(`/api/contacts/ward?ward=${wardId}`))
  const data = await response.json()
  return data
}

export const addContact = async (contact: Contact): Promise<Response> => {
  const response = await fetch(apiUrl('/api/contacts'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  })

  console.log('formData', contact)

  if (!response.ok) {
    throw new Error('Failed to add contact')
  }
  console.log('Thêm liên hệ thành công!')

  return response
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(apiUrl('/api/contacts/upload-image'), {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Upload image failed')
  }

  const data = await response.json()
  return data.filePath // "/uploads/xxx.png"
}

export const updateContact = async (contact: Contact): Promise<Response> => {
  const response = await fetch(
    apiUrl(`/api/contacts/${contact.btlhcm_lh_malh}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    }
  )

  console.log('Cập nhật liên hệ:', contact)

  if (!response.ok) {
    throw new Error('Failed to update contact')
  }
  console.log('Cập nhật liên hệ thành công!')

  return response
}

export const deleteContact = async (contact: Contact): Promise<Response> => {
  const response = await fetch(
    apiUrl(`/api/contacts/${contact.btlhcm_lh_malh}`),
    {
      method: 'DELETE',
    }
  )
  return response
}

export const importContactsFromExcel = async (
  file: File
): Promise<Response> => {
  const formData = new FormData()
  formData.append('file', file) // 'file' phải trùng với tên field multer nhận ở backend

  const response = await fetch(apiUrl('/api/contacts/import-excel'), {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Nhập danh bạ thất bại')
  }
  console.log('Nhập danh bạ thành công!')
  return response
}

export const exportExcel = async (): Promise<Response> => {
  const response = await fetch(apiUrl('/api/contacts/export-excel'))
  if (!response.ok) {
    throw new Error('Xuất CSV thất bại')
  }
  window.location.href = apiUrl('/api/contacts/export-excel')
  return response
}

export const exportVcard = async (): Promise<Response> => {
  const response = await fetch(apiUrl('/api/contacts/export-vcard'))
  if (!response.ok) {
    throw new Error('Xuất VCard thất bại')
  }
  window.location.href = apiUrl('/api/contacts/export-vcard')
  return response
}
