import { pool } from '../db.js'

export const getAllLocations = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM donvi
  `)
  res.json(result.rows)
}
