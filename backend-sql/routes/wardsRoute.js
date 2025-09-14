import express from 'express'
import {
  getAllWards,
  getWardsById,
  getWardByUser,
} from '../controllers/wardsController.js'

const router = express.Router()

router.get('/', getAllWards)
router.get('/:id', getWardsById)
router.get('/user/:btlhcm_nd_mand', getWardByUser)

export default router
