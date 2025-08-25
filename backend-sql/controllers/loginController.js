import { pool } from '../db.js'
import jwt from 'jsonwebtoken'

// Đăng nhập
export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await pool.query(
      'SELECT nd.btlhcm_nd_mand, nd.btlhcm_nd_trangthai, vt.btlhcm_vt_mavt, vt.btlhcm_vt_tenvt FROM nguoidung nd JOIN vaitronguoidung vtnd on nd.btlhcm_nd_mand = vtnd.btlhcm_vtnd_mand JOIN vaitro vt on vt.btlhcm_vt_mavt = vtnd.btlhcm_vtnd_mavt WHERE nd.btlhcm_nd_mand = $1 AND nd.btlhcm_nd_matkhau = $2',
      [username, password]
    )

    console.log(result.rows)

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Tài khoản hoặc mật khẩu không chính xác' })
    }

    if (result.rows[0].btlhcm_nd_trangthai === false) {
      return res.status(401).json({ message: 'Tài khoản đã bị vô hiệu hóa' })
    }

    // Tạo token
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    let roles = []
    for (const row of result.rows) {
      roles.push({
        btlhcm_vt_mavt: row.btlhcm_vt_mavt,
        btlhcm_vt_tenvt: row.btlhcm_vt_tenvt,
      })
    }

    const token = jwt.sign({ username, roles }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    })

    // Gửi token qua cookie + response luôn 1 lần
    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 3 * 1000, // 3 giờ
    })

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user: result.rows[0],
      token,
      roles,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

// Đăng xuất
export const userLogout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
  })
  return res.status(200).json({ message: 'Đăng xuất thành công' })
}
