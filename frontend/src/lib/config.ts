export const API_BASE_URL = 
// 'http://localhost:5000/'
'https://danh-ba-quan-doi.onrender.com/'
export const apiUrl = (path: string): string => {
  const base = API_BASE_URL.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}
