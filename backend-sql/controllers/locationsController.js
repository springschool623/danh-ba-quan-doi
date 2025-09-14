import { pool } from '../db.js'

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
