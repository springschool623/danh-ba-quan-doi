import express from 'express'
import {
  getAllProvinces,
  getProvincesById,
} from '../controllers/provincesController.js'

const router = express.Router()

router.get('/', getAllProvinces)
router.get('/:id', getProvincesById)

export default router
