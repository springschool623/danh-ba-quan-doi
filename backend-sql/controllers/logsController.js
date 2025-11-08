import { pool } from '../db.js'
import { getUserFromRequest } from '../utils/logHelper.js'

/**
 * Lấy tất cả logs (chỉ admin)
 */
export const getAllLogs = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    const { userId, role } = getUserFromRequest(req)

    console.log('🔍 Kiểm tra quyền xem logs:', {
      userId,
      role,
      roleType: typeof role,
    })

    // Chỉ cho phép Super Admin hoặc Quản trị viên xem logs
    // So sánh linh hoạt để tránh vấn đề encoding
    const roleStr = String(role || '').trim()
    const isAdmin =
      roleStr.includes('Quản trị hệ thống') ||
      roleStr.includes('Super Admin') ||
      roleStr.includes('Quản trị viên') ||
      roleStr === 'Quản trị hệ thống (Super Admin)' ||
      roleStr === 'Quản trị viên Cấp Phường'

    console.log('🔍 Kết quả kiểm tra quyền:', { roleStr, isAdmin })

    if (!isAdmin) {
      console.warn('⚠️ User không có quyền xem logs:', {
        userId,
        role,
        roleStr,
      })
      return res.status(403).json({
        error:
          'Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền xem logs.',
      })
    }

    // Lấy query parameters cho phân trang và lọc
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const offset = (page - 1) * limit
    const action = req.query.action // Lọc theo hành động
    const table = req.query.table // Lọc theo bảng
    const startDate = req.query.startDate // Lọc theo ngày bắt đầu
    const endDate = req.query.endDate // Lọc theo ngày kết thúc
    const userIdFilter = req.query.userId // Lọc theo mã người dùng

    // Xây dựng query
    let query = `
      SELECT 
        l.*,
        nd.btlhcm_nd_mand
      FROM log l
      LEFT JOIN nguoidung nd ON l.btlhcm_log_mand = nd.btlhcm_nd_mand
      WHERE 1=1
    `
    const queryParams = []
    let paramIndex = 1

    // Lọc theo action
    if (action) {
      query += ` AND l.btlhcm_log_hanhdong = $${paramIndex}`
      queryParams.push(action)
      paramIndex++
    }

    // Lọc theo table
    if (table) {
      query += ` AND l.btlhcm_log_bang = $${paramIndex}`
      queryParams.push(table)
      paramIndex++
    }

    // Lọc theo ngày
    if (startDate) {
      query += ` AND l.btlhcm_log_ngaytao >= $${paramIndex}`
      queryParams.push(startDate)
      paramIndex++
    }

    if (endDate) {
      query += ` AND l.btlhcm_log_ngaytao <= $${paramIndex}`
      queryParams.push(endDate)
      paramIndex++
    }

    // Lọc theo mã người dùng
    if (userIdFilter) {
      query += ` AND l.btlhcm_log_mand ILIKE $${paramIndex}`
      queryParams.push(`%${userIdFilter}%`)
      paramIndex++
    }

    // Sắp xếp theo thời gian mới nhất
    query += ` ORDER BY l.btlhcm_log_ngaytao DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`
    queryParams.push(limit, offset)

    // Lấy tổng số logs
    let countQuery = `
      SELECT COUNT(*) as total
      FROM log l
      WHERE 1=1
    `
    const countParams = []
    let countParamIndex = 1

    if (action) {
      countQuery += ` AND l.btlhcm_log_hanhdong = $${countParamIndex}`
      countParams.push(action)
      countParamIndex++
    }

    if (table) {
      countQuery += ` AND l.btlhcm_log_bang = $${countParamIndex}`
      countParams.push(table)
      countParamIndex++
    }

    if (startDate) {
      countQuery += ` AND l.btlhcm_log_ngaytao >= $${countParamIndex}`
      countParams.push(startDate)
      countParamIndex++
    }

    if (endDate) {
      countQuery += ` AND l.btlhcm_log_ngaytao <= $${countParamIndex}`
      countParams.push(endDate)
      countParamIndex++
    }

    if (userIdFilter) {
      countQuery += ` AND l.btlhcm_log_mand ILIKE $${countParamIndex}`
      countParams.push(`%${userIdFilter}%`)
      countParamIndex++
    }

    const [logsResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, countParams),
    ])

    const total = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)

    res.json({
      logs: logsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Lỗi khi lấy logs:', error)
    res.status(500).json({ error: 'Lỗi khi lấy logs' })
  }
}

/**
 * Lấy log theo ID
 */
export const getLogById = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    const { userId, role } = getUserFromRequest(req)

    // So sánh linh hoạt để tránh vấn đề encoding
    const roleStr = String(role || '').trim()
    const isAdmin =
      roleStr.includes('Quản trị hệ thống') ||
      roleStr.includes('Super Admin') ||
      roleStr.includes('Quản trị viên') ||
      roleStr === 'Quản trị hệ thống (Super Admin)' ||
      roleStr === 'Quản trị viên Cấp Phường'

    if (!isAdmin) {
      return res.status(403).json({
        error: 'Bạn không có quyền truy cập trang này',
      })
    }

    const { id } = req.params
    const result = await pool.query(
      `SELECT l.*, nd.btlhcm_nd_mand
       FROM log l
       LEFT JOIN nguoidung nd ON l.btlhcm_log_mand = nd.btlhcm_nd_mand
       WHERE l.btlhcm_log_id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Log không tồn tại' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Lỗi khi lấy log:', error)
    res.status(500).json({ error: 'Lỗi khi lấy log' })
  }
}
