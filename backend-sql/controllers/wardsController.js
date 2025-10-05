import { pool } from '../db.js'
import * as XLSX from 'xlsx'
import fs from 'fs'
import { getIdByName, normalizeKey } from '../utils.js'
import { WARDS_COLUMN_MAP } from '../constants.js'

export const getAllWards = async (req, res) => {
  const result = await pool.query(`
    SELECT px.*, tt.btlhcm_tt_tentt FROM phuongxa px join tinhthanh tt on px.btlhcm_px_tinhthanh = tt.btlhcm_tt_matt
  `)
  res.json(result.rows)
}

export const getWardsById = async (req, res) => {
  const { id } = req.params
  const result = await pool.query(
    `
    SELECT * FROM phuongxa WHERE btlhcm_px_mapx = $1
  `,
    [id]
  )
  res.json(result.rows)
}

//User chỉ được xem danh bạ theo Phường/Xã mà họ có quyền truy cập
export const getWardByUser = async (req, res) => {
  const { btlhcm_nd_mand } = req.params
  const result = await pool.query(
    `
    SELECT px.btlhcm_px_mapx, px.btlhcm_px_tenpx
    FROM QuyenTruyCapTheoKhuVuc qtckv
    JOIN nguoidung nd ON nd.btlhcm_nd_mand = qtckv.btlhcm_qtckv_mand
    JOIN phuongxa px ON px.btlhcm_px_mapx = qtckv.btlhcm_qtckv_mapx
    WHERE btlhcm_nd_mand = $1
  `,
    [btlhcm_nd_mand]
  )
  res.json(result.rows)
}

//Set quyền truy cập danh bạ theo Phường/Xã
export const setWardByUserRole = async (req, res) => {
  const { btlhcm_nd_mand, btlhcm_px_mapx } = req.params
  const result = await pool.query(
    `
    INSERT INTO QuyenTruyCapTheoKhuVuc (btlhcm_qtckv_mand, btlhcm_qtckv_mapx) VALUES ($1, $2)
  `,
    [btlhcm_nd_mand, btlhcm_px_mapx]
  )
  res.json(result.rows)
}

export const addWard = async (req, res) => {
  const { btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh } = req.body
  const result = await pool.query(
    `INSERT INTO phuongxa (btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh) VALUES ($1, $2, $3)`,
    [btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh]
  )
  res.json(result.rows)
}

//Nhập địa chỉ từ file Excel
export const importWardsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file upload' })
    }

    const filePath = req.file.path

    // Đọc file Excel
    const fileBuffer = fs.readFileSync(filePath)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Lấy raw data: mảng 2D
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    })

    if (rawData.length < 2) {
      return res.status(400).json({ error: 'File Excel không có dữ liệu' })
    }

    // Hàng đầu tiên là header
    const headers = rawData[0].map((h) => normalizeKey(h))
    console.log('headers', headers)

    // Convert thành mảng object với key chuẩn
    const rows = rawData.slice(1).map((row) => {
      const obj = {}
      headers.forEach((h, i) => {
        if (WARDS_COLUMN_MAP[h]) {
          obj[WARDS_COLUMN_MAP[h]] = row[i]
        }
      })
      return obj
    })

    console.log('Excel rows:', rows)

    let importedCount = 0

    for (const row of rows) {
      if (!row.tenphuong) continue

      const tenphuong = row.tenphuong
      const mota = row.mota

      console.log('row.tinhthanh', row.tinhthanh)

      const tinhthanhId = await getIdByName(
        'btlhcm_tt_matt',
        'tinhthanh',
        'btlhcm_tt_tentt',
        row.tinhthanh
      )

      console.log('Dữ liệu insert:', {
        tenphuong,
        mota,
        tinhthanhId,
      })

      await pool.query(
        `INSERT INTO phuongxa (
          btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh
        ) VALUES ($1,$2,$3)`,
        [tenphuong, mota, tinhthanhId]
      )

      importedCount++
    }

    // Xoá file tạm
    fs.unlinkSync(filePath)

    res.json({ success: true, imported: importedCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi khi import Excel' })
  }
}

export const updateWard = async (req, res) => {
  console.log('req.body', req.body)
  const {
    btlhcm_px_mapx,
    btlhcm_px_tenpx,
    btlhcm_px_mota,
    btlhcm_px_tinhthanh,
  } = req.body

  console.log('btlhcm_px_mapx', btlhcm_px_mapx)
  console.log('btlhcm_px_tenpx', btlhcm_px_tenpx)
  console.log('btlhcm_px_mota', btlhcm_px_mota)
  console.log('btlhcm_px_tinhthanh', btlhcm_px_tinhthanh)

  const result = await pool.query(
    `UPDATE phuongxa SET btlhcm_px_tenpx = $1, btlhcm_px_mota = $2, btlhcm_px_tinhthanh = $3 WHERE btlhcm_px_mapx = $4`,
    [btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh, btlhcm_px_mapx]
  )
  res.json(result.rows)
}
