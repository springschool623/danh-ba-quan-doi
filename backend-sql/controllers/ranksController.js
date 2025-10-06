import { pool } from '../db.js'

export const getAllRanks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM capbac ORDER BY btlhcm_cb_macb
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching ranks:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createRank = async (req, res) => {
  try {
    console.log('Create rank:', req.body)
    const { btlhcm_cb_tencb } = req.body
    const result = await pool.query(
      'INSERT INTO capbac (btlhcm_cb_tencb) VALUES ($1) RETURNING *',
      [btlhcm_cb_tencb]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating rank:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateRank = async (req, res) => {
  try {
    const { btlhcm_cb_macb } = req.params
    const { btlhcm_cb_tencb } = req.body
    const result = await pool.query(
      'UPDATE capbac SET btlhcm_cb_tencb = $1, btlhcm_cb_ngaycapnhat = CURRENT_TIMESTAMP WHERE btlhcm_cb_macb = $2 RETURNING *',
      [btlhcm_cb_tencb, btlhcm_cb_macb]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rank not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating rank:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
