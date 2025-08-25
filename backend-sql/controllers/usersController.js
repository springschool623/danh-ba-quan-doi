import { pool } from '../db.js'

export const getAllUsers = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM nguoidung
  `)
  res.json(result.rows)
}

export const addUser = async (req, res) => {
  const { btlhcm_nd_mand, btlhcm_nd_matkhau } = req.body
  const result = await pool.query(
    `INSERT INTO nguoidung (btlhcm_nd_mand, btlhcm_nd_matkhau, btlhcm_nd_trangthai) VALUES ($1, $2, $3)`,
    [btlhcm_nd_mand, btlhcm_nd_matkhau, true]
  )
  res.json(result.rows)
}

export const updateUser = async (req, res) => {
  const { btlhcm_nd_mand, btlhcm_nd_matkhau } = req.body
  const result = await pool.query(
    `UPDATE nguoidung SET btlhcm_nd_matkhau = $1, btlhcm_nd_ngaycapnhat = $2 WHERE btlhcm_nd_mand = $3`,
    [btlhcm_nd_matkhau, new Date(), btlhcm_nd_mand]
  )
  res.json(result.rows)
}

export const disableUser = async (req, res) => {
  const { btlhcm_nd_mand } = req.params
  console.log('Mã người dùng: ', btlhcm_nd_mand)
  const result = await pool.query(
    `UPDATE nguoidung SET btlhcm_nd_trangthai = $1 WHERE btlhcm_nd_mand = $2`,
    [false, btlhcm_nd_mand]
  )
  res.json(result.rows)
}

// Thêm nhiều vai trò cho người dùng
export const addRolesToUser = async (req, res) => {
  const { btlhcm_nd_mand } = req.params
  const { roles } = req.body
  console.log('Vai trò: ', roles)
  try {
    for (const role of roles) {
      const result = await pool.query(
        `INSERT INTO vaitronguoidung (btlhcm_vtnd_mand, btlhcm_vtnd_mavt) VALUES ($1, $2) ON CONFLICT (btlhcm_vtnd_mand, btlhcm_vtnd_mavt) DO NOTHING`,
        [btlhcm_nd_mand, role]
      )
      res.json(result.rows)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi khi thêm vai trò' })
  }
}
