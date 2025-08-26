import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import contactRoutes from './routes/contactsRoute.js'
import militaryRegionsRoutes from './routes/militaryRegionsRoute.js'
import provincesRoutes from './routes/provincesRoute.js'
import wardsRoutes from './routes/wardsRoute.js'
import loginRoutes from './routes/loginRoute.js'
import ranksRoutes from './routes/ranksRoute.js'
import positionsRoutes from './routes/positionsRoute.js'
import departmentsRoutes from './routes/departmentsRoute.js'
import committeesRoutes from './routes/committeesRoute.js'
import locationsRoutes from './routes/locationsRoute.js'
import rolesRoutes from './routes/rolesRoute.js'
import usersRoutes from './routes/usersRoute.js'
import { fileURLToPath } from 'url'
import setupDatabase from './setup.js'

dotenv.config() // load .env

const app = express()
const port = process.env.PORT || 5000
app.use(
  cors({
    origin: 'https://danh-ba-quan-doi.vercel.app',
    credentials: true,
  })
)
app.use(express.json())

app.use('/api/contacts', contactRoutes)
app.use('/api/military-regions', militaryRegionsRoutes)
app.use('/api/provinces', provincesRoutes)
app.use('/api/wards', wardsRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/ranks', ranksRoutes)
app.use('/api/positions', positionsRoutes)
app.use('/api/departments', departmentsRoutes)
app.use('/api/committees', committeesRoutes)
app.use('/api/locations', locationsRoutes)
app.use('/api/roles', rolesRoutes)
app.use('/api/users', usersRoutes)

app.get('/', (req, res) => {
  res.send(`Server running on port ${process.env.PORT}`)
})

// Export the app and start function
export const startServer = async () => {
  try {
    // Setup database before starting server
    setupDatabase()

    // Start server after database is ready
    app.listen(port, () => {
      console.log(`🚀 Server đang chạy trên port ${port}`)
      console.log('\n📋 Thông tin hệ thống phân quyền:')
      console.log('   - Super Admin: Tất cả quyền')
      console.log(
        '   - Data Entry: Quản lý contacts (view, edit, import, export)'
      )
      console.log('   - Auditor: Chỉ xem dữ liệu')
      console.log(
        '   - Officer Account Manager: Quản lý tài khoản và phân quyền'
      )
    })
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error)
    process.exit(1)
  }
}

// Only start the server if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer()
}

export default app
