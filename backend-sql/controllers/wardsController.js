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
