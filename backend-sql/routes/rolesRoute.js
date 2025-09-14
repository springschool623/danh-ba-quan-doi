import express from 'express'
import {
  getAllRoles,
  getUserPermissionByRole,
} from '../controllers/rolesController.js'

const router = express.Router()

router.get('/', getAllRoles)
router.get('/:btlhcm_vtnd_mand', getUserPermissionByRole)

export default router
