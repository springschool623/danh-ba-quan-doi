import { pool } from '../db.js'
import * as XLSX from 'xlsx'
import fs from 'fs'
import { getIdByName, normalizeKey } from '../utils.js'
import { LOCATIONS_COLUMN_MAP } from '../constants.js'

export const getAllLocations = async (req, res) => {
  const result = await pool.query(`
    SELECT dv.*, px.btlhcm_px_tenpx, tt.btlhcm_tt_tentt, qk.btlhcm_qk_tenqk FROM donvi dv JOIN phuongxa px ON dv.btlhcm_dv_phuong = px.btlhcm_px_mapx JOIN tinhthanh tt ON dv.btlhcm_dv_tinhthanh = tt.btlhcm_tt_matt JOIN quankhu qk ON dv.btlhcm_dv_quankhu = qk.btlhcm_qk_maqk
  `)
  res.json(result.rows)
}

export const addLocation = async (req, res) => {
  console.log('req.body', req.body)

  const { btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong } = req.body

  const result = await pool.query(
    `
    INSERT INTO donvi (btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong, btlhcm_dv_tinhthanh, btlhcm_dv_quankhu, btlhcm_dv_ngaytao, btlhcm_dv_ngaycapnhat) VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,
    [
      btlhcm_dv_tendv,
      btlhcm_dv_diachi,
      btlhcm_dv_phuong,
      1,
      7,
      new Date(),
      new Date(),
    ]
  )
  res.json(result.rows)
}

export const updateLocation = async (req, res) => {
  const {
    btlhcm_dv_madv,
    btlhcm_dv_tendv,
    btlhcm_dv_diachi,
    btlhcm_dv_phuong,
  } = req.body
  const result = await pool.query(
    `UPDATE donvi SET btlhcm_dv_tendv = $1, btlhcm_dv_diachi = $2, btlhcm_dv_phuong = $3, btlhcm_dv_ngaycapnhat = $4 WHERE btlhcm_dv_madv = $5`,
    [
      btlhcm_dv_tendv,
      btlhcm_dv_diachi,
      btlhcm_dv_phuong,
      new Date(),
      btlhcm_dv_madv,
    ]
  )
  res.json(result.rows)
}

//Nhập địa chỉ từ file Excel
export const importLocationsFromExcel = async (req, res) => {
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
        if (LOCATIONS_COLUMN_MAP[h]) {
          obj[LOCATIONS_COLUMN_MAP[h]] = row[i]
        }
      })
      return obj
    })

    console.log('Excel rows:', rows)

    let importedCount = 0

    for (const row of rows) {
      if (!row.tendonvi) continue

      const tendonvi = row.tendonvi
      const diachi = row.diachi

      const phuongId = await getIdByName(
        'btlhcm_px_mapx',
        'phuongxa',
        'btlhcm_px_tenpx',
        row.phuong
      )

      const tinhthanhId = await getIdByName(
        'btlhcm_tt_matt',
        'tinhthanh',
        'btlhcm_tt_tentt',
        row.tinhthanh
      )

      const quankhuId = await getIdByName(
        'btlhcm_qk_maqk',
        'quankhu',
        'btlhcm_qk_tenqk',
        row.quankhu
      )

      console.log('Dữ liệu insert:', {
        tendonvi,
        diachi,
        phuongId,
        tinhthanhId,
        quankhuId,
      })

      await pool.query(
        `INSERT INTO donvi (
          btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong, btlhcm_dv_tinhthanh, btlhcm_dv_quankhu
        ) VALUES ($1,$2,$3,$4,$5)`,
        [tendonvi, diachi, phuongId, tinhthanhId, quankhuId]
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
