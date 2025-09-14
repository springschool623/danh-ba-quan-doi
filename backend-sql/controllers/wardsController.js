import { pool } from '../db.js'

export const getAllWards = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM phuongxa
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
