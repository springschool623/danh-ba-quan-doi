import { pool } from '../db.js'

export const getAllRoles = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM vaitro
  `)
  res.json(result.rows)
}
