import { pool } from '../db.js'
import jwt from 'jsonwebtoken'

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await pool.query(
      'SELECT * FROM nguoidung WHERE btlhcm_nd_mand = $1 AND btlhcm_nd_matkhau = $2',
      [username, password]
    )

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Tài khoản hoặc mật khẩu không chính xác' })
    }

    // Tạo token
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    })

    // Gửi token qua cookie + response luôn 1 lần
    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 1000, // 1 ngày
    })

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user: result.rows[0],
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

export const userLogout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
  })
  return res.status(200).json({ message: 'Đăng xuất thành công' })
}
