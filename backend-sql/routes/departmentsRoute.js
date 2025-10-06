import express from 'express'
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
} from '../controllers/departmentsController.js'

const router = express.Router()

router.get('/', getAllDepartments)
router.post('/', createDepartment)
router.put('/:btlhcm_pb_mapb', updateDepartment)

export default router
