import { pool } from '../db.js'

// Lấy tất cả danh bạ
export const getAllContacts = async (req, res) => {
  const result = await pool.query(`
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, dv.btlhcm_dv_tendv
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phongban pb ON db.btlhcm_lh_phongban = pb.btlhcm_pb_mapb
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
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, dv.btlhcm_dv_tendv, qk.btlhcm_qk_tenqk
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phongban pb ON db.btlhcm_lh_phongban = pb.btlhcm_pb_mapb
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
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, dv.btlhcm_dv_tendv, tt.btlhcm_tt_tentt
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phongban pb ON db.btlhcm_lh_phongban = pb.btlhcm_pb_mapb
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
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, dv.btlhcm_dv_tendv, px.btlhcm_px_tenpx
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phongban pb ON db.btlhcm_lh_phongban = pb.btlhcm_pb_mapb
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
    btlhcm_lh_phongban,
    btlhcm_lh_donvi,
    btlhcm_lh_sdt_ds,
    btlhcm_lh_sdt_qs,
    btlhcm_lh_sdt_dd,
  } = req.body
  const result = await pool.query(
    'INSERT INTO danhbalienhe (btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu, btlhcm_lh_phongban, btlhcm_lh_donvi, btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_dd, btlhcm_lh_ngaytao, btlhcm_lh_ngaycapnhat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [
      btlhcm_lh_hoten,
      btlhcm_lh_capbac,
      btlhcm_lh_chucvu,
      btlhcm_lh_phongban,
      btlhcm_lh_donvi,
      btlhcm_lh_sdt_ds,
      btlhcm_lh_sdt_qs,
      btlhcm_lh_sdt_dd,
      new Date(),
      new Date(),
    ]
  )
  res.json(result.rows)
}

export const updateContact = async (req, res) => {
  const { btlhcm_lh_malh } = req.params
  const {
    btlhcm_lh_hoten,
    btlhcm_lh_capbac,
    btlhcm_lh_chucvu,
    btlhcm_lh_phongban,
    btlhcm_lh_donvi,
    btlhcm_lh_sdt_ds,
    btlhcm_lh_sdt_qs,
    btlhcm_lh_sdt_dd,
  } = req.body
  const result = await pool.query(
    'UPDATE danhbalienhe SET btlhcm_lh_hoten = $1, btlhcm_lh_capbac = $2, btlhcm_lh_chucvu = $3, btlhcm_lh_phongban = $4, btlhcm_lh_donvi = $5, btlhcm_lh_sdt_ds = $6, btlhcm_lh_sdt_qs = $7, btlhcm_lh_sdt_dd = $8, btlhcm_lh_ngaycapnhat = $9 WHERE btlhcm_lh_malh = $10',
    [
      btlhcm_lh_hoten,
      btlhcm_lh_capbac,
      btlhcm_lh_chucvu,
      btlhcm_lh_phongban,
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

export const deleteContact = async (req, res) => {
  const { btlhcm_lh_malh } = req.params
  const result = await pool.query(
    'DELETE FROM danhbalienhe WHERE btlhcm_lh_malh = $1',
    [btlhcm_lh_malh]
  )
  res.json(result.rows)
}
