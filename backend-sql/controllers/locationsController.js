import { pool } from '../db.js'
import * as XLSX from 'xlsx'
import fs from 'fs'
import { getIdByName, normalizeKey } from '../utils.js'
import { LOCATIONS_COLUMN_MAP } from '../constants.js'
import { writeLog, getUserFromRequest } from '../utils/logHelper.js'

export const getAllLocations = async (req, res) => {
  const result = await pool.query(`
    SELECT dv.*, px.btlhcm_px_tenpx, tt.btlhcm_tt_tentt, qk.btlhcm_qk_tenqk FROM donvi dv JOIN phuongxa px ON dv.btlhcm_dv_phuong = px.btlhcm_px_mapx JOIN tinhthanh tt ON dv.btlhcm_dv_tinhthanh = tt.btlhcm_tt_matt JOIN quankhu qk ON dv.btlhcm_dv_quankhu = qk.btlhcm_qk_maqk
  `)
  res.json(result.rows)
}

export const addLocation = async (req, res) => {
  try {
    console.log('req.body', req.body)

    const { btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong } = req.body

    const result = await pool.query(
      `
      INSERT INTO donvi (btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong, btlhcm_dv_tinhthanh, btlhcm_dv_quankhu, btlhcm_dv_ngaytao, btlhcm_dv_ngaycapnhat) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING btlhcm_dv_madv
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
    
    // Ghi log
    const { userId, role } = getUserFromRequest(req)
    if (userId && result.rows.length > 0) {
      await writeLog({
        userId,
        role,
        action: 'CREATE',
        table: 'donvi',
        recordId: result.rows[0].btlhcm_dv_madv,
        recordName: btlhcm_dv_tendv,
        details: `Thêm mới đơn vị: ${btlhcm_dv_tendv}`,
      })
    }
    
    res.json(result.rows)
  } catch (error) {
    console.error('Lỗi khi thêm đơn vị:', error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'CREATE',
      table: 'donvi',
      recordId: null,
      recordName: req.body?.btlhcm_dv_tendv || 'Unknown',
      details: `Thêm mới đơn vị: ${req.body?.btlhcm_dv_tendv || 'Unknown'}`,
      error,
      isError: true,
    })
    
    res.status(500).json({ error: 'Lỗi khi thêm đơn vị: ' + error.message })
  }
}

export const updateLocation = async (req, res) => {
  try {
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
    
    // Ghi log
    const { userId, role } = getUserFromRequest(req)
    if (userId && result.rowCount > 0) {
      await writeLog({
        userId,
        role,
        action: 'UPDATE',
        table: 'donvi',
        recordId: btlhcm_dv_madv,
        recordName: btlhcm_dv_tendv,
        details: `Cập nhật đơn vị: ${btlhcm_dv_tendv}`,
      })
    }
    
    res.json(result.rows)
  } catch (error) {
    console.error('Lỗi khi cập nhật đơn vị:', error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'UPDATE',
      table: 'donvi',
      recordId: req.body?.btlhcm_dv_madv || null,
      recordName: req.body?.btlhcm_dv_tendv || 'Unknown',
      details: `Cập nhật đơn vị: ${req.body?.btlhcm_dv_tendv || 'Unknown'}`,
      error,
      isError: true,
    })
    
    res.status(500).json({ error: 'Lỗi khi cập nhật đơn vị: ' + error.message })
  }
}

// Xóa nhiều đơn vị
export const deleteMultipleLocations = async (req, res) => {
  try {
    const { ids } = req.body // ids là mảng các btlhcm_dv_madv
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Danh sách ID không hợp lệ' })
    }

    // Lấy thông tin đơn vị trước khi xóa để ghi log
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ')
    const locationsResult = await pool.query(
      `SELECT btlhcm_dv_madv, btlhcm_dv_tendv FROM donvi WHERE btlhcm_dv_madv IN (${placeholders})`,
      ids
    )

    // Sử dụng IN clause để xóa nhiều bản ghi cùng lúc
    const result = await pool.query(
      `DELETE FROM donvi WHERE btlhcm_dv_madv IN (${placeholders})`,
      ids
    )

    // Ghi log
    const { userId, role } = getUserFromRequest(req)
    if (userId && result.rowCount > 0) {
      const locationNames = locationsResult.rows.map(r => r.btlhcm_dv_tendv).join(', ')
      await writeLog({
        userId,
        role,
        action: 'DELETE',
        table: 'donvi',
        recordId: null,
        recordName: `${result.rowCount} đơn vị`,
        details: `Xóa ${result.rowCount} đơn vị: ${locationNames}`,
        count: result.rowCount,
      })
    }

    res.json({ 
      success: true, 
      deletedCount: result.rowCount,
      message: `Đã xóa ${result.rowCount} đơn vị thành công` 
    })
  } catch (error) {
    console.error('Lỗi khi xóa nhiều đơn vị:', error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'DELETE',
      table: 'donvi',
      recordId: null,
      recordName: `Xóa nhiều đơn vị (${req.body?.ids?.length || 0} ID)`,
      details: `Xóa nhiều đơn vị: ${JSON.stringify(req.body?.ids || [])}`,
      error,
      isError: true,
    })
    
    res.status(500).json({ error: 'Lỗi khi xóa nhiều đơn vị: ' + error.message })
  }
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
    let updatedCount = 0
    const errors = []
    let rowNumber = 2 // Bắt đầu từ row 2 vì row 1 là header

    for (const row of rows) {
      if (!row.tendonvi) {
        rowNumber++
        continue
      }

      try {
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

        await pool.query(
          `INSERT INTO donvi (
            btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong, btlhcm_dv_tinhthanh, btlhcm_dv_quankhu
          ) VALUES ($1,$2,$3,$4,$5)`,
          [tendonvi, diachi, phuongId, tinhthanhId, quankhuId]
        )

        importedCount++
      } catch (rowError) {
        // Kiểm tra lỗi unique constraint
        if (rowError.code === '23505') {
          // Unique constraint violation - tên đơn vị đã tồn tại, thực hiện UPDATE
          try {
            // Tìm đơn vị hiện có bằng tên
            const existingLocation = await pool.query(
              `SELECT btlhcm_dv_madv FROM donvi WHERE btlhcm_dv_tendv = $1`,
              [row.tendonvi]
            )

            if (existingLocation.rows.length > 0) {
              // Cập nhật đơn vị hiện có
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

              await pool.query(
                `UPDATE donvi SET 
                  btlhcm_dv_diachi = $1,
                  btlhcm_dv_phuong = $2,
                  btlhcm_dv_tinhthanh = $3,
                  btlhcm_dv_quankhu = $4,
                  btlhcm_dv_ngaycapnhat = $5
                WHERE btlhcm_dv_tendv = $6`,
                [
                  row.diachi,
                  phuongId,
                  tinhthanhId,
                  quankhuId,
                  new Date(),
                  row.tendonvi,
                ]
              )

              updatedCount++
            } else {
              errors.push(
                `Dòng ${rowNumber}: Không tìm thấy đơn vị "${row.tendonvi}"`
              )
            }
          } catch (updateError) {
            errors.push(
              `Dòng ${rowNumber}: Lỗi khi cập nhật đơn vị "${row.tendonvi}" - ${updateError.message}`
            )
          }
        } else {
          errors.push(
            `Dòng ${rowNumber}: Lỗi khi nhập đơn vị "${row.tendonvi}" - ${rowError.message}`
          )
        }
      }
      rowNumber++
    }

    // Xoá file tạm
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Ghi log
    const { userId, role } = getUserFromRequest(req)
    if (userId) {
      // Ghi log cho các record được INSERT
      if (importedCount > 0) {
        await writeLog({
          userId,
          role,
          action: 'IMPORT',
          table: 'donvi',
          recordId: null,
          recordName: `Nhập ${importedCount} đơn vị`,
          details: `Nhập ${importedCount} đơn vị mới thành công`,
          count: importedCount,
        })
      }

      // Ghi log riêng cho các record được UPDATE
      if (updatedCount > 0) {
        await writeLog({
          userId,
          role,
          action: 'UPDATE',
          table: 'donvi',
          recordId: null,
          recordName: `Cập nhật ${updatedCount} đơn vị`,
          details: `Cập nhật đơn vị`,
          count: updatedCount,
        })
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        imported: importedCount,
        updated: updatedCount,
        errors: errors,
        message: `Đã nhập ${importedCount} đơn vị mới, cập nhật ${updatedCount} đơn vị. Có ${errors.length} lỗi xảy ra.`,
      })
    }

    res.json({ 
      success: true, 
      imported: importedCount,
      updated: updatedCount,
      message: `Đã nhập ${importedCount} đơn vị mới, cập nhật ${updatedCount} đơn vị thành công.`
    })
  } catch (error) {
    console.error(error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'IMPORT',
      table: 'donvi',
      recordId: null,
      recordName: `Import đơn vị từ Excel`,
      details: `Import đơn vị từ file: ${req.file?.originalname || 'Unknown'}`,
      error,
      isError: true,
    })
    
    // Xoá file tạm nếu có lỗi
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ error: 'Lỗi khi import Excel: ' + error.message })
  }
}
