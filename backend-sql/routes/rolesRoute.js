import express from 'express'
import { getAllRoles } from '../controllers/rolesController.js'

const router = express.Router()

router.get('/', getAllRoles)

export default router
