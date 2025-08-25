import { pool } from '../db.js'

export const getAllPermissions = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM quyenhan
  `)
  res.json(result.rows)
}
