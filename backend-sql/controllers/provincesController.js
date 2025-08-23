import { pool } from '../db.js'

export const getAllProvinces = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM tinhthanh
  `)
  res.json(result.rows)
}

export const getProvincesById = async (req, res) => {
  const { id } = req.params
  const result = await pool.query(
    `
    SELECT * FROM tinhthanh WHERE btlhcm_tt_matt = $1
  `,
    [id]
  )
  res.json(result.rows)
}
