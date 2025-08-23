import { pool } from '../db.js'

export const getAllDepartments = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM phongban
  `)
  res.json(result.rows)
}
