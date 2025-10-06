import { pool } from '../db.js'

export const getAllDepartments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM phong ORDER BY btlhcm_pb_mapb
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching departments:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createDepartment = async (req, res) => {
  try {
    const { btlhcm_pb_tenpb } = req.body
    const result = await pool.query(
      'INSERT INTO phong (btlhcm_pb_tenpb) VALUES ($1) RETURNING *',
      [btlhcm_pb_tenpb]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating department:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateDepartment = async (req, res) => {
  try {
    const { btlhcm_pb_mapb } = req.params
    const { btlhcm_pb_tenpb } = req.body
    const result = await pool.query(
      'UPDATE phong SET btlhcm_pb_tenpb = $1, btlhcm_pb_ngaycapnhat = CURRENT_TIMESTAMP WHERE btlhcm_pb_mapb = $2 RETURNING *',
      [btlhcm_pb_tenpb, btlhcm_pb_mapb]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating department:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
