import express from 'express'
import {
  getAllUsers,
  addUser,
  disableUser,
  updateUser,
  addRolesToUser,
  getUserRoles,
} from '../controllers/usersController.js'

const router = express.Router()

router.get('/', getAllUsers)
router.post('/', addUser)
router.put('/:btlhcm_nd_mand', updateUser)
router.put('/:btlhcm_nd_mand/disable', disableUser)
router.put('/:btlhcm_nd_mand/add-roles', addRolesToUser)
router.get('/:btlhcm_nd_mand/roles', getUserRoles)

export default router
