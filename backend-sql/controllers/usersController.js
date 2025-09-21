import { pool } from '../db.js'

export const getAllUsers = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM nguoidung
  `)
  res.json(result.rows)
}

export const getCurrentUser = async (req, res) => {
  const { btlhcm_nd_mand } = req.params
  const result = await pool.query(
    `SELECT * FROM nguoidung WHERE btlhcm_nd_mand = $1`,
    [btlhcm_nd_mand]
  )
  res.json(result.rows)
}

export const addUser = async (req, res) => {
  const { btlhcm_nd_mand, btlhcm_nd_matkhau } = req.body
  const result = await pool.query(
    `INSERT INTO nguoidung (btlhcm_nd_mand, btlhcm_nd_matkhau, btlhcm_nd_trangthai) VALUES ($1, $2, $3)`,
    [btlhcm_nd_mand, btlhcm_nd_matkhau, true]
  )
  if (result.rowCount > 0) {
    console.log('Thêm người dùng thành công!')
    await pool.query(
      `INSERT INTO vaitronguoidung (btlhcm_vtnd_mand, btlhcm_vtnd_mavt) VALUES ($1, $2)`,
      [btlhcm_nd_mand, 4]
    )
    await pool.query(
      `INSERT INTO quyentruycaptheokhuvuc (btlhcm_qtckv_mand, btlhcm_qtckv_maqk, btlhcm_qtckv_matt, btlhcm_qtckv_mapx) VALUES ($1, $2, $3, $4)`,
      [btlhcm_nd_mand, null, 1, null]
    )
  } else {
    console.log('Thêm người dùng thất bại!')
  }
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

export const changeUserStatus = async (req, res) => {
  try {
    const { btlhcm_nd_mand } = req.params

    // Lấy trạng thái hiện tại trong DB
    const current = await pool.query(
      `SELECT btlhcm_nd_trangthai FROM nguoidung WHERE btlhcm_nd_mand = $1`,
      [btlhcm_nd_mand]
    )

    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    const currentStatus = current.rows[0].btlhcm_nd_trangthai
    const newStatus = !currentStatus // đảo ngược boolean

    // Cập nhật lại DB
    const result = await pool.query(
      `UPDATE nguoidung 
       SET btlhcm_nd_trangthai = $1 
       WHERE btlhcm_nd_mand = $2 
       RETURNING *`,
      [newStatus, btlhcm_nd_mand]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi khi thay đổi trạng thái người dùng' })
  }
}

// Thêm nhiều vai trò cho người dùng
export const addRolesToUser = async (req, res) => {
  const { btlhcm_nd_mand } = req.params
  const { roles } = req.body
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
