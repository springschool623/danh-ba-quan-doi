import { Contact } from '@/types/contacts'

export const getContacts = async (): Promise<Contact[]> => {
  const response = await fetch('http://localhost:5000/api/contacts')
  const data = await response.json()
  return data
}

export const getContactsByMilitaryRegion = async (
  militaryRegionId: number
): Promise<Contact[]> => {
  const response = await fetch(
    `http://localhost:5000/api/contacts/military-region?region=${militaryRegionId}`
  )
  const data = await response.json()
  return data
}

export const getContactsByProvince = async (
  provinceId: number
): Promise<Contact[]> => {
  const response = await fetch(
    `http://localhost:5000/api/contacts/province?province=${provinceId}`
  )
  const data = await response.json()
  return data
}

export const getContactsByWard = async (wardId: number): Promise<Contact[]> => {
  const response = await fetch(
    `http://localhost:5000/api/contacts/ward?ward=${wardId}`
  )
  const data = await response.json()
  return data
}

export const updateContact = async (
  contactId: string,
  updatedData: Partial<Contact>
): Promise<Contact> => {
  const response = await fetch(
    `http://localhost:5000/api/contacts/${contactId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update contact')
  }

  const data = await response.json()
  return data
}

export const addContact = async (contact: Contact): Promise<Response> => {
  const response = await fetch('http://localhost:5000/api/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  })

  if (!response.ok) {
    throw new Error('Failed to add contact')
  }
  console.log('Thêm liên hệ thành công!')

  return response
}
