import express from 'express'
import {
  getAllLocations,
  addLocation,
  updateLocation,
} from '../controllers/locationsController.js'

const router = express.Router()

router.get('/', getAllLocations)
router.post('/', addLocation)
router.put('/:btlhcm_dv_madv', updateLocation)

export default router
