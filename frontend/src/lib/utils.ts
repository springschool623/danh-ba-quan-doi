import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format date
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error(error)
    return '-'
  }
}
