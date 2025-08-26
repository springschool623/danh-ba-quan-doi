import express from 'express'
import {
  getAllUsers,
  addUser,
  changeUserStatus,
  updateUser,
  addRolesToUser,
  getUserRoles,
  getCurrentUser,
} from '../controllers/usersController.js'

const router = express.Router()

router.get('/', getAllUsers)
router.post('/', addUser)
router.put('/:btlhcm_nd_mand', updateUser)
router.put('/:btlhcm_nd_mand/change-status', changeUserStatus)
router.put('/:btlhcm_nd_mand/add-roles', addRolesToUser)
router.get('/:btlhcm_nd_mand/roles', getUserRoles)
router.get('/:btlhcm_nd_mand', getCurrentUser)

export default router
