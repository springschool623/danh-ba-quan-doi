import { pool } from '../db.js'

export const getAllCommittees = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM ban
  `)
  res.json(result.rows)
}
