import { pool } from '../db.js'

export const getAllRanks = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM capbac
  `)
  res.json(result.rows)
}
