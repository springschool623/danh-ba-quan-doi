import { pool } from './db.js'

export function normalizeString(str) {
  if (!str) return str
  return str
    .normalize('NFC') // chuẩn Unicode dựng sẵn
    .trim() // bỏ space thừa đầu/cuối
}

// Hàm normalize key: bỏ dấu, đưa về lowercase, bỏ khoảng trắng, bỏ ký tự đặc biệt
export function normalizeKey(key) {
  if (!key) return ''
  return key
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD') // tách dấu tổ hợp
    .replace(/đ/g, 'd') // thay đ → d
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/[^a-z0-9]/g, '') // bỏ ký tự không phải a-z0-9 (bao gồm dấu chấm)
}

// Hàm normalize header (bỏ khoảng trắng thừa, đưa về chữ thường, chuẩn Unicode)
export function normalizeHeader(header) {
  if (!header) return ''
  return header.toString().trim().toLowerCase().normalize('NFC')
}

// Lấy ID theo tên
export async function getIdByName(id, table, column, value) {
  if (!value) return null
  const normalizedValue = normalizeString(value)
  console.log('normalizedValue', normalizedValue)
  const result = await pool.query(
    `SELECT ${id} FROM ${table} WHERE ${column} ILIKE $1 LIMIT 1`,
    [normalizedValue]
  )
  // console.log('ID:', result.rows[0][id])
  return result.rows.length ? result.rows[0][id] : null
}
