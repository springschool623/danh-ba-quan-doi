import { pool } from '../db.js'

export const getAllPositions = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM chucvu
  `)
  res.json(result.rows)
}
