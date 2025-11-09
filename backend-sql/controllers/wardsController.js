import { pool } from '../db.js'
import * as XLSX from 'xlsx'
import fs from 'fs'
import { getIdByName, normalizeKey } from '../utils.js'
import { WARDS_COLUMN_MAP } from '../constants.js'
import { writeLog, getUserFromRequest } from '../utils/logHelper.js'

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
  const { btlhcm_nd_mand } = req.params
  const { wards } = req.body
  try {
    // Xóa tất cả quyền truy cập hiện tại của user
    await pool.query(
      `DELETE FROM QuyenTruyCapTheoKhuVuc WHERE btlhcm_qtckv_mand = $1`,
      [btlhcm_nd_mand]
    )

    // Thêm các quyền truy cập mới
    for (const ward of wards) {
      await pool.query(
        `INSERT INTO QuyenTruyCapTheoKhuVuc (btlhcm_qtckv_mand, btlhcm_qtckv_mapx) VALUES ($1, $2)`,
        [btlhcm_nd_mand, ward]
      )
    }

    // Trả về response thành công
    res.json({ message: 'Cập nhật quyền truy cập thành công', wards: wards })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi khi cập nhật quyền truy cập' })
  }
}

export const addWard = async (req, res) => {
  try {
    const { btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh } = req.body
    const result = await pool.query(
      `INSERT INTO phuongxa (btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh) VALUES ($1, $2, $3) RETURNING btlhcm_px_mapx`,
      [btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh]
    )
    
    // Ghi log
    const { userId, role } = getUserFromRequest(req)
    if (userId && result.rows.length > 0) {
      await writeLog({
        userId,
        role,
        action: 'CREATE',
        table: 'phuongxa',
        recordId: result.rows[0].btlhcm_px_mapx,
        recordName: btlhcm_px_tenpx,
        details: `Thêm mới phường xã: ${btlhcm_px_tenpx}`,
      })
    }
    
    res.json(result.rows)
  } catch (error) {
    console.error('Lỗi khi thêm phường xã:', error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'CREATE',
      table: 'phuongxa',
      recordId: null,
      recordName: req.body?.btlhcm_px_tenpx || 'Unknown',
      details: `Thêm mới phường xã: ${req.body?.btlhcm_px_tenpx || 'Unknown'}`,
      error,
      isError: true,
    })
    
    res.status(500).json({ error: 'Lỗi khi thêm phường xã: ' + error.message })
  }
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
    let updatedCount = 0
    const errors = []
    let rowNumber = 2 // Bắt đầu từ row 2 vì row 1 là header

    for (const row of rows) {
      if (!row.tenphuong) {
        rowNumber++
        continue
      }

      try {
        const tenphuong = row.tenphuong
        const mota = row.mota

        const tinhthanhId = await getIdByName(
          'btlhcm_tt_matt',
          'tinhthanh',
          'btlhcm_tt_tentt',
          row.tinhthanh
        )

        await pool.query(
          `INSERT INTO phuongxa (
            btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_tinhthanh
          ) VALUES ($1,$2,$3)`,
          [tenphuong, mota, tinhthanhId]
        )

        importedCount++
      } catch (rowError) {
        // Kiểm tra lỗi unique constraint
        if (rowError.code === '23505') {
          // Unique constraint violation - phường xã đã tồn tại trong tỉnh thành, thực hiện UPDATE
          try {
            const tinhthanhId = await getIdByName(
              'btlhcm_tt_matt',
              'tinhthanh',
              'btlhcm_tt_tentt',
              row.tinhthanh
            )

            // Tìm phường xã hiện có bằng tên và tỉnh thành
            const existingWard = await pool.query(
              `SELECT btlhcm_px_mapx FROM phuongxa 
               WHERE btlhcm_px_tenpx = $1 AND btlhcm_px_tinhthanh = $2`,
              [row.tenphuong, tinhthanhId]
            )

            if (existingWard.rows.length > 0) {
              // Cập nhật phường xã hiện có
              await pool.query(
                `UPDATE phuongxa SET 
                  btlhcm_px_mota = $1
                WHERE btlhcm_px_tenpx = $2 AND btlhcm_px_tinhthanh = $3`,
                [
                  row.mota,
                  row.tenphuong,
                  tinhthanhId,
                ]
              )

              updatedCount++
            } else {
              errors.push(
                `Dòng ${rowNumber}: Không tìm thấy phường xã "${row.tenphuong}" trong tỉnh/thành "${row.tinhthanh}"`
              )
            }
          } catch (updateError) {
            errors.push(
              `Dòng ${rowNumber}: Lỗi khi cập nhật phường xã "${row.tenphuong}" - ${updateError.message}`
            )
          }
        } else {
          errors.push(
            `Dòng ${rowNumber}: Lỗi khi nhập phường xã "${row.tenphuong}" - ${rowError.message}`
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
          table: 'phuongxa',
          recordId: null,
          recordName: `Nhập ${importedCount} phường xã`,
          details: `Nhập ${importedCount} phường xã mới thành công`,
          count: importedCount,
        })
      }

      // Ghi log riêng cho các record được UPDATE
      if (updatedCount > 0) {
        await writeLog({
          userId,
          role,
          action: 'UPDATE',
          table: 'phuongxa',
          recordId: null,
          recordName: `Cập nhật ${updatedCount} phường xã`,
          details: `Cập nhật phường xã`,
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
        message: `Đã nhập ${importedCount} phường xã mới, cập nhật ${updatedCount} phường xã. Có ${errors.length} lỗi xảy ra.`,
      })
    }

    res.json({ 
      success: true, 
      imported: importedCount,
      updated: updatedCount,
      message: `Đã nhập ${importedCount} phường xã mới, cập nhật ${updatedCount} phường xã thành công.`
    })
  } catch (error) {
    console.error(error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'IMPORT',
      table: 'phuongxa',
      recordId: null,
      recordName: `Import phường xã từ Excel`,
      details: `Import phường xã từ file: ${req.file?.originalname || 'Unknown'}`,
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

export const updateWard = async (req, res) => {
  try {
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
    
    // Ghi log
    const { userId, role } = getUserFromRequest(req)
    if (userId && result.rowCount > 0) {
      await writeLog({
        userId,
        role,
        action: 'UPDATE',
        table: 'phuongxa',
        recordId: btlhcm_px_mapx,
        recordName: btlhcm_px_tenpx,
        details: `Cập nhật phường xã: ${btlhcm_px_tenpx}`,
      })
    }
    
    res.json(result.rows)
  } catch (error) {
    console.error('Lỗi khi cập nhật phường xã:', error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'UPDATE',
      table: 'phuongxa',
      recordId: req.body?.btlhcm_px_mapx || null,
      recordName: req.body?.btlhcm_px_tenpx || 'Unknown',
      details: `Cập nhật phường xã: ${req.body?.btlhcm_px_tenpx || 'Unknown'}`,
      error,
      isError: true,
    })
    
    res.status(500).json({ error: 'Lỗi khi cập nhật phường xã: ' + error.message })
  }
}

// Xóa nhiều phường xã
export const deleteMultipleWards = async (req, res) => {
  try {
    const { ids } = req.body // ids là mảng các btlhcm_px_mapx
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Danh sách ID không hợp lệ' })
    }

    // Lấy thông tin phường xã trước khi xóa để ghi log
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ')
    const wardsResult = await pool.query(
      `SELECT btlhcm_px_mapx, btlhcm_px_tenpx FROM phuongxa WHERE btlhcm_px_mapx IN (${placeholders})`,
      ids
    )

    // Sử dụng IN clause để xóa nhiều bản ghi cùng lúc
    const result = await pool.query(
      `DELETE FROM phuongxa WHERE btlhcm_px_mapx IN (${placeholders})`,
      ids
    )

    // Ghi log
    const { userId, role } = getUserFromRequest(req)
    if (userId && result.rowCount > 0) {
      const wardNames = wardsResult.rows.map(r => r.btlhcm_px_tenpx).join(', ')
      await writeLog({
        userId,
        role,
        action: 'DELETE',
        table: 'phuongxa',
        recordId: null,
        recordName: `${result.rowCount} phường xã`,
        details: `Xóa ${result.rowCount} phường xã: ${wardNames}`,
        count: result.rowCount,
      })
    }

    res.json({ 
      success: true, 
      deletedCount: result.rowCount,
      message: `Đã xóa ${result.rowCount} phường xã thành công` 
    })
  } catch (error) {
    console.error('Lỗi khi xóa nhiều phường xã:', error)
    
    // Ghi log lỗi
    const { userId, role } = getUserFromRequest(req)
    await writeLog({
      userId,
      role,
      action: 'DELETE',
      table: 'phuongxa',
      recordId: null,
      recordName: `Xóa nhiều phường xã (${req.body?.ids?.length || 0} ID)`,
      details: `Xóa nhiều phường xã: ${JSON.stringify(req.body?.ids || [])}`,
      error,
      isError: true,
    })
    
    res.status(500).json({ error: 'Lỗi khi xóa nhiều phường xã: ' + error.message })
  }
}