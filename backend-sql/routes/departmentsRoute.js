import express from 'express'
import { getAllDepartments } from '../controllers/departmentsController.js'

const router = express.Router()

router.get('/', getAllDepartments)

export default router
