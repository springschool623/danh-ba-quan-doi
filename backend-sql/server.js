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

dotenv.config() // load .env

const app = express()
app.use(
  cors({
    origin: 'https://danh-ba-quan-doi.onrender.com',
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
