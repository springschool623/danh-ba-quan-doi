import { pool } from '../db.js'
import jwt from 'jsonwebtoken'

/**
 * Ghi log vào database
 * @param {Object} logData - Dữ liệu log
 * @param {string} logData.userId - Mã người dùng
 * @param {string} logData.role - Vai trò của người dùng
 * @param {string} logData.action - Hành động (CREATE, READ, UPDATE, DELETE, IMPORT, EXPORT)
 * @param {string} logData.table - Tên bảng (danhbalienhe, donvi, phuongxa, etc.)
 * @param {number} [logData.recordId] - ID của bản ghi
 * @param {string} [logData.recordName] - Tên hiển thị của bản ghi
 * @param {string} [logData.details] - Chi tiết thay đổi
 * @param {number} [logData.count] - Số lượng bản ghi (cho bulk operations)
 */
export const writeLog = async (logData) => {
  try {
    const {
      userId,
      role,
      action,
      table,
      recordId = null,
      recordName = null,
      details = null,
      count = 1,
    } = logData

    // Chỉ ghi log nếu có userId
    if (!userId) {
      console.warn('⚠️ Không có userId, bỏ qua ghi log', { action, table })
      return
    }

    console.log('📝 Đang ghi log:', { userId, role, action, table, recordId, recordName })
    
    await pool.query(
      `INSERT INTO log (
        btlhcm_log_mand, 
        btlhcm_log_vaitro, 
        btlhcm_log_hanhdong, 
        btlhcm_log_bang, 
        btlhcm_log_maid, 
        btlhcm_log_tenbang, 
        btlhcm_log_chitiet, 
        btlhcm_log_soluong
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, role, action, table, recordId, recordName, details, count]
    )
    
    console.log('✅ Ghi log thành công')
  } catch (error) {
    // Không throw error để không ảnh hưởng đến flow chính
    // Chỉ log ra console để debug
    console.error('❌ Lỗi khi ghi log:', error.message, error.code)
    // Kiểm tra xem bảng log đã tồn tại chưa
    if (error.code === '42P01') {
      console.error('❌ Bảng log chưa được tạo trong database. Vui lòng chạy script tạo bảng log.')
    }
  }
}

/**
 * Lấy thông tin user từ request (từ JWT token trong header hoặc cookie)
 * @param {Object} req - Express request object
 * @returns {Object} { userId, role }
 */
export const getUserFromRequest = (req) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization
    let token = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Lấy từ cookie nếu có
      const cookies = req.headers.cookie
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/)
        if (tokenMatch) {
          token = tokenMatch[1]
        }
      }
    }

    if (!token) {
      return {
        userId: null,
        role: 'Unknown',
      }
    }

    // Verify và decode JWT token
    try {
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
      if (!JWT_SECRET_KEY) {
        console.warn('JWT_SECRET_KEY không được cấu hình')
        return {
          userId: null,
          role: 'Unknown',
        }
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY)
      const userId = decoded.username || decoded.userId
      
      // Lấy role từ roles array (có thể có nhiều roles)
      let role = 'Unknown'
      if (decoded.roles && Array.isArray(decoded.roles) && decoded.roles.length > 0) {
        // Lấy role đầu tiên, hoặc tìm Super Admin nếu có
        const superAdminRole = decoded.roles.find(
          r => r.btlhcm_vt_tenvt?.includes('Quản trị hệ thống') || 
               r.btlhcm_vt_tenvt?.includes('Super Admin')
        )
        role = superAdminRole?.btlhcm_vt_tenvt || decoded.roles[0]?.btlhcm_vt_tenvt || 'Unknown'
      } else if (decoded.role) {
        role = decoded.role
      }

      console.log('✅ Lấy thông tin user từ token:', { 
        userId, 
        role,
        allRoles: decoded.roles?.map(r => r.btlhcm_vt_tenvt) || []
      })
      return {
        userId,
        role,
      }
    } catch (jwtError) {
      console.error('Lỗi verify JWT token:', jwtError.message)
      return {
        userId: null,
        role: 'Unknown',
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin user từ request:', error)
    return {
      userId: null,
      role: 'Unknown',
    }
  }
}

