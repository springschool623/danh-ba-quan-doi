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
    // Xóa tất cả vai trò hiện tại của user
    await pool.query(
      `DELETE FROM vaitronguoidung WHERE btlhcm_vtnd_mand = $1`,
      [btlhcm_nd_mand]
    )

    // Thêm các vai trò mới
    for (const role of roles) {
      await pool.query(
        `INSERT INTO vaitronguoidung (btlhcm_vtnd_mand, btlhcm_vtnd_mavt) VALUES ($1, $2)`,
        [btlhcm_nd_mand, role]
      )
    }

    // Trả về response thành công
    res.json({ message: 'Cập nhật vai trò thành công', roles: roles })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi khi cập nhật vai trò' })
  }
}

export const getUserRoles = async (req, res) => {
  const { btlhcm_nd_mand } = req.params
  const result = await pool.query(
    `SELECT * FROM vaitronguoidung vtnd JOIN vaitro vt ON vtnd.btlhcm_vtnd_mavt = vt.btlhcm_vt_mavt WHERE btlhcm_vtnd_mand = $1`,
    [btlhcm_nd_mand]
  )
  res.json(result.rows)
}
