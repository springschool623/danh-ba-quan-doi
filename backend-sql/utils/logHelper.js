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
 * @param {Error|string} [logData.error] - Lỗi xảy ra (nếu có)
 * @param {boolean} [logData.isError] - Đánh dấu đây là log lỗi
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
      error = null,
      isError = false,
    } = logData

    // Chỉ ghi log nếu có userId (trừ khi là lỗi hệ thống)
    if (!userId && !isError) {
      console.warn('⚠️ Không có userId, bỏ qua ghi log', { action, table })
      return
    }

    // Format chi tiết lỗi nếu có
    let logDetails = details
    if (isError && error) {
      let errorMessage = error instanceof Error ? error.message : String(error)
      
      // Chỉ lấy dòng đầu tiên (message chính), bỏ phần stack trace
      errorMessage = errorMessage.split('\n')[0].trim()
      
      // Rút gọn các loại lỗi phổ biến
      if (errorMessage.includes('violates unique constraint')) {
        // Lấy tên constraint và bảng liên quan
        const constraintMatch = errorMessage.match(/"([^"]+)"/)
        if (constraintMatch) {
          const constraintName = constraintMatch[1]
          
          // Loại bỏ "_key" ở cuối nếu có
          let cleanName = constraintName.replace(/_key$/, '')
          
          // Tách tên bảng: phần đầu tiên (trước dấu _ đầu tiên của field pattern)
          // Ví dụ: "phuongxa_btlhcm_px_tinhthanh_btlhcm_px_tenpx" -> table: "phuongxa"
          const firstUnderscore = cleanName.indexOf('_')
          const tableName = firstUnderscore > 0 
            ? cleanName.substring(0, firstUnderscore) 
            : cleanName.split('_')[0] || 'bảng'
          
          // Tìm các field: tìm pattern "btlhcm_px_*" hoặc "btlhcm_*_*"
          // Sử dụng regex để tìm tất cả các field names
          const fieldPatterns = [
            /btlhcm_[a-z]+_([a-z]+)/g, // Pattern: btlhcm_px_tinhthanh -> tinhthanh
            /btlhcm_([a-z]+)_([a-z]+)/g, // Pattern: btlhcm_px_tenpx -> tenpx
          ]
          
          const fields = []
          for (const pattern of fieldPatterns) {
            let match
            while ((match = pattern.exec(cleanName)) !== null) {
              // Lấy phần cuối cùng (tên field thực sự)
              const fieldName = match[match.length - 1]
              if (fieldName && !fields.includes(fieldName)) {
                fields.push(fieldName)
              }
            }
          }
          
          // Nếu không tìm được bằng pattern, thử cách đơn giản hơn
          if (fields.length === 0) {
            const parts = cleanName.split('_')
            // Bỏ qua phần đầu (table name) và các prefix "btlhcm", "px"
            const remaining = parts.filter((part, idx) => {
              // Bỏ qua table name (phần đầu)
              if (idx === 0) return false
              // Bỏ qua các prefix phổ biến
              if (part === 'btlhcm' || part === 'px' || part === 'px') return false
              return true
            })
            
            // Lấy các phần không trùng lặp
            fields.push(...new Set(remaining))
          }
          
          // Rút gọn: chỉ lấy tên field ngắn gọn (loại bỏ prefix dài)
          const shortFields = fields
            .filter(f => f && f.length > 0)
            .map(f => {
              // Nếu field name có nhiều phần, chỉ lấy phần cuối
              const parts = f.split('_')
              return parts.length > 1 ? parts[parts.length - 1] : f
            })
            .filter((f, idx, arr) => arr.indexOf(f) === idx) // Loại bỏ trùng lặp
            .slice(0, 3) // Chỉ lấy tối đa 3 field
          
          if (shortFields.length > 0) {
            errorMessage = `Dữ liệu trùng lặp ở ${tableName} (${shortFields.join(', ')})`
          } else {
            errorMessage = `Dữ liệu trùng lặp ở ${tableName}`
          }
        } else {
          errorMessage = 'Dữ liệu trùng lặp'
        }
      } else if (errorMessage.includes('violates foreign key constraint')) {
        errorMessage = 'Dữ liệu không hợp lệ (khóa ngoại)'
      } else if (errorMessage.includes('violates not-null constraint')) {
        const match = errorMessage.match(/column "([^"]+)"/)
        if (match) {
          errorMessage = `Thiếu thông tin bắt buộc: ${match[1]}`
        } else {
          errorMessage = 'Thiếu thông tin bắt buộc'
        }
      } else if (errorMessage.includes('syntax error')) {
        errorMessage = 'Lỗi cú pháp truy vấn'
      } else if (errorMessage.includes('connection')) {
        errorMessage = 'Lỗi kết nối database'
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Quá thời gian chờ'
      }
      
      // Loại bỏ các thông tin không cần thiết (file path, line number, etc.)
      errorMessage = errorMessage
        .replace(/at\s+.*/g, '')
        .replace(/\(.*\)/g, '') // Loại bỏ file path trong ngoặc
        .replace(/\s+/g, ' ')
        .trim()
      
      // Giới hạn độ dài message
      if (errorMessage.length > 150) {
        errorMessage = errorMessage.substring(0, 150) + '...'
      }
      
      logDetails = `LỖI: ${errorMessage}`
      if (details) {
        logDetails = `${details}\n${logDetails}`
      }
    }

    // Thêm prefix ERROR vào action nếu là lỗi
    const logAction = isError ? `ERROR_${action}` : action

    console.log(`📝 Đang ghi log ${isError ? 'LỖI' : ''}:`, { userId, role, action: logAction, table, recordId, recordName })
    
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
      [userId || 'SYSTEM', role || 'SYSTEM', logAction, table, recordId, recordName, logDetails, count]
    )
    
    console.log(`✅ Ghi log ${isError ? 'LỖI' : ''} thành công`)
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

