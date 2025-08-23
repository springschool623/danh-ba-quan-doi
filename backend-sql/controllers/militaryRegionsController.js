import { pool } from '../db.js'

export const getAllMilitaryRegions = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM quankhu
  `)
  res.json(result.rows)
}

export const getMilitaryRegionsById = async (req, res) => {
  const { id } = req.params
  const result = await pool.query(
    `
    SELECT * FROM quankhu WHERE btlhcm_qk_maqk = $1
  `,
    [id]
  )
  res.json(result.rows)
}
