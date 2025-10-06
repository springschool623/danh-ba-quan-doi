import { pool } from '../db.js'

export const getAllCommittees = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, p.btlhcm_pb_tenpb 
      FROM ban b 
      LEFT JOIN phong p ON b.btlhcm_ba_maphong = p.btlhcm_pb_mapb 
      ORDER BY b.btlhcm_ba_mab
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching committees:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createCommittee = async (req, res) => {
  try {
    const { btlhcm_ba_tenb, btlhcm_ba_maphong } = req.body
    const result = await pool.query(
      'INSERT INTO ban (btlhcm_ba_tenb, btlhcm_ba_maphong) VALUES ($1, $2) RETURNING *',
      [btlhcm_ba_tenb, btlhcm_ba_maphong]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating committee:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateCommittee = async (req, res) => {
  try {
    const { btlhcm_ba_mab } = req.params
    const { btlhcm_ba_tenb, btlhcm_ba_maphong } = req.body
    const result = await pool.query(
      'UPDATE ban SET btlhcm_ba_tenb = $1, btlhcm_ba_maphong = $2, btlhcm_ba_ngaycapnhat = CURRENT_TIMESTAMP WHERE btlhcm_ba_mab = $3 RETURNING *',
      [btlhcm_ba_tenb, btlhcm_ba_maphong, btlhcm_ba_mab]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Committee not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating committee:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
