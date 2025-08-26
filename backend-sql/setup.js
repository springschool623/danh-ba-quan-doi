import { pool } from './db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function setupDatabase() {
  try {
    console.log('🔄 Đang thiết lập cơ sở dữ liệu...')

    // Kiểm tra và xóa database cũ nếu tồn tại
    const { checkDatabaseExists, dropDatabase, createDatabase } = await import(
      './sql/database.js'
    )

    const dbExists = await checkDatabaseExists()
    if (dbExists) {
      console.log('🗑️ Database đã tồn tại, đang xóa...')
      await dropDatabase()
      console.log('✅ Database cũ đã được xóa')
    }

    // Tạo database mới
    console.log('🏗️ Đang tạo database mới...')
    await createDatabase()
    console.log('✅ Database mới đã được tạo')

    // Đọc và thực thi schema
    const { createSchema } = await import('./sql/schema.js')
    await createSchema()
    console.log('✅ Schema đã được tạo thành công')

    // Đọc và thực thi seeds
    const { runSeeds } = await import('./sql/seed.js')
    await runSeeds()
    console.log('✅ Dữ liệu mẫu đã được tạo thành công')

    console.log('🎉 Thiết lập cơ sở dữ liệu hoàn tất!')
    console.log('\n📋 Thông tin hệ thống phân quyền:')
    console.log('   - Super Admin: Tất cả quyền')
    console.log(
      '   - Data Entry: Quản lý contacts (view, edit, import, export)'
    )
    console.log('   - Auditor: Chỉ xem dữ liệu')
    console.log('   - Officer Account Manager: Quản lý tài khoản và phân quyền')
  } catch (error) {
    console.error('❌ Lỗi khi thiết lập cơ sở dữ liệu:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}
