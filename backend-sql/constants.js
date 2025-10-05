import { pool } from './db.js'

// Map các cột trong Excel → tên chuẩn bạn muốn dùng
export const LOCATIONS_COLUMN_MAP = {
  tendonvi: 'tendonvi',
  diachi: 'diachi',
  phuongxa: 'phuong',
  tinhthanh: 'tinhthanh',
  quankhu: 'quankhu',
}

// Map header Excel (sau khi normalizeKey) -> key trong code
export const CONTACTS_COLUMN_MAP = {
  hoten: 'hoten',
  capbac: 'capbac',
  chucvu: 'chucvu',
  phong: 'phong',
  ban: 'ban',
  donvi: 'donvi',
  sdtDs: 'sdtDs',
  sdtQs: 'sdtQs',
  sdtDd: 'sdtDd',
  sdtFax: 'sdtFax',
}

// Map header Excel (sau khi normalizeKey) -> key trong code
export const WARDS_COLUMN_MAP = {
  tenphuong: 'tenphuong',
  mota: 'mota',
  tinhthanh: 'tinhthanh',
}
