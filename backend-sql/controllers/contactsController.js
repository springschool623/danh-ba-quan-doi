import { pool } from '../db.js'
import * as XLSX from 'xlsx'

// Lấy tất cả danh bạ
export const getAllContacts = async (req, res) => {
  const result = await pool.query(`
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    ORDER BY db.btlhcm_lh_malh ASC
  `)
  res.json(result.rows)
}

// Lấy danh bạ theo Cấp Quân Khu
export const getContactsByMilitaryRegion = async (req, res) => {
  const { region } = req.query
  const result = await pool.query(
    `
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, qk.btlhcm_qk_tenqk, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    LEFT JOIN quankhu qk ON dv.btlhcm_dv_quankhu = qk.btlhcm_qk_maqk
    WHERE qk.btlhcm_qk_maqk = $1
    ORDER BY db.btlhcm_lh_malh ASC
  `,
    [region]
  )
  res.json(result.rows)
}

// Lấy danh bạ theo Cấp Tỉnh
export const getContactsByProvince = async (req, res) => {
  const { province } = req.query
  const result = await pool.query(
    `
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, tt.btlhcm_tt_tentt, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    LEFT JOIN tinhthanh tt ON dv.btlhcm_dv_tinhthanh = tt.btlhcm_tt_matt
    WHERE dv.btlhcm_dv_tinhthanh = $1
    ORDER BY db.btlhcm_lh_malh ASC
  `,
    [province]
  )
  res.json(result.rows)
}

// Lấy danh bạ theo Cấp Phường
export const getContactsByWard = async (req, res) => {
  const { ward } = req.query
  const result = await pool.query(
    `
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, px.btlhcm_px_tenpx, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    LEFT JOIN phuongxa px ON dv.btlhcm_dv_phuong = px.btlhcm_px_mapx
    WHERE px.btlhcm_px_mapx = $1
    ORDER BY db.btlhcm_lh_malh ASC
  `,
    [ward]
  )
  res.json(result.rows)
}

// Thêm danh bạ
export const addContact = async (req, res) => {
  const {
    btlhcm_lh_hoten,
    btlhcm_lh_capbac,
    btlhcm_lh_chucvu,
    btlhcm_lh_phong,
    btlhcm_lh_ban,
    btlhcm_lh_donvi,
    btlhcm_lh_sdt_ds,
    btlhcm_lh_sdt_qs,
    btlhcm_lh_sdt_dd,
  } = req.body
  const result = await pool.query(
    'INSERT INTO danhbalienhe (btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu, btlhcm_lh_phong, btlhcm_lh_ban, btlhcm_lh_donvi, btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_dd, btlhcm_lh_ngaytao, btlhcm_lh_ngaycapnhat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [
      btlhcm_lh_hoten,
      btlhcm_lh_capbac || null,
      btlhcm_lh_chucvu || null,
      btlhcm_lh_phong || null,
      btlhcm_lh_ban || null,
      btlhcm_lh_donvi || null,
      btlhcm_lh_sdt_ds || null,
      btlhcm_lh_sdt_qs || null,
      btlhcm_lh_sdt_dd || null,
      new Date(),
      new Date(),
    ]
  )
  res.json(result.rows)
}

// Cập nhật danh bạ
export const updateContact = async (req, res) => {
  const { btlhcm_lh_malh } = req.params
  const {
    btlhcm_lh_hoten,
    btlhcm_lh_capbac,
    btlhcm_lh_chucvu,
    btlhcm_lh_phong,
    btlhcm_lh_ban,
    btlhcm_lh_donvi,
    btlhcm_lh_sdt_ds,
    btlhcm_lh_sdt_qs,
    btlhcm_lh_sdt_dd,
  } = req.body
  const result = await pool.query(
    'UPDATE danhbalienhe SET btlhcm_lh_hoten = $1, btlhcm_lh_capbac = $2, btlhcm_lh_chucvu = $3, btlhcm_lh_phong = $4, btlhcm_lh_ban = $5, btlhcm_lh_donvi = $6, btlhcm_lh_sdt_ds = $7, btlhcm_lh_sdt_qs = $8, btlhcm_lh_sdt_dd = $9, btlhcm_lh_ngaycapnhat = $10 WHERE btlhcm_lh_malh = $11',
    [
      btlhcm_lh_hoten,
      btlhcm_lh_capbac,
      btlhcm_lh_chucvu,
      btlhcm_lh_phong,
      btlhcm_lh_ban,
      btlhcm_lh_donvi,
      btlhcm_lh_sdt_ds,
      btlhcm_lh_sdt_qs,
      btlhcm_lh_sdt_dd,
      new Date(),
      btlhcm_lh_malh,
    ]
  )
  res.json(result.rows)
}

// Xoá danh bạ
export const deleteContact = async (req, res) => {
  const { btlhcm_lh_malh } = req.params
  const result = await pool.query(
    'DELETE FROM danhbalienhe WHERE btlhcm_lh_malh = $1',
    [btlhcm_lh_malh]
  )
  res.json(result.rows)
}

// Xuất Excel
export const exportExcel = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    ORDER BY db.btlhcm_lh_malh ASC
  `)
    // Chuyển dữ liệu query thành mảng object
    const data = result.rows.map((row) => ({
      STT: row.btlhcm_lh_malh,
      'Họ tên': row.btlhcm_lh_hoten,
      'Cấp bậc': row.btlhcm_cb_tencb,
      'Chức vụ': row.btlhcm_cv_tencv,
      Ban: row.btlhcm_ba_tenb,
      Phòng: row.btlhcm_pb_tenpb,
      'Đơn vị': row.btlhcm_dv_tendv,
      'Địa chỉ': row.btlhcm_dv_diachi,
      'SĐT Dân sự': row.btlhcm_lh_sdt_ds,
      'SĐT Quân sự': row.btlhcm_lh_sdt_qs,
      'SĐT Di động': row.btlhcm_lh_sdt_dd,
    }))

    // Tạo worksheet từ json
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Tạo workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh bạ liên hệ')

    // Ghi ra buffer (dạng Excel)
    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    })

    // Gửi file về client
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="danhba_btlhcm.xlsx"'
    )
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.send(buffer)
  } catch (err) {
    console.error('❌ Lỗi xuất Excel:', err)
    res.status(500).json({ message: 'Lỗi xuất Excel' })
  }
}

// Xuất VCard
export const exportVcard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, 
             ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, dv.btlhcm_dv_diachi
      FROM danhbalienhe db 
      LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
      LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
      LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
      LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
      LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
      ORDER BY db.btlhcm_lh_malh ASC
    `)

    // Tạo nội dung VCF
    let vcfContent = result.rows
      .map((row) => {
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${row.btlhcm_lh_hoten}`,
          `ORG:${row.btlhcm_dv_tendv || ''}`,
          `TITLE:${row.btlhcm_cv_tencv || ''}`,
          `TEL;TYPE=work,voice:${row.btlhcm_lh_sdt_ds || ''}`,
          `TEL;TYPE=other,voice:${row.btlhcm_lh_sdt_qs || ''}`,
          `TEL;TYPE=cell,voice:${row.btlhcm_lh_sdt_dd || ''}`,
          `ADR;TYPE=work:;;${row.btlhcm_dv_diachi || ''}`,
          'END:VCARD',
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n\n')

    res.setHeader('Content-Type', 'text/vcard; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="danhba_btlhcm.vcf"'
    )
    res.status(200).send(vcfContent)
  } catch (err) {
    console.error('❌ Lỗi export VCard:', err)
    res.status(500).json({ message: 'Lỗi export VCard' })
  }
}
