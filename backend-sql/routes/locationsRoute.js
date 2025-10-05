import express from 'express'
import {
  getAllLocations,
  addLocation,
  updateLocation,
  importLocationsFromExcel,
} from '../controllers/locationsController.js'
import multer from 'multer'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/', getAllLocations)
router.post('/', addLocation)
router.put('/:btlhcm_dv_madv', updateLocation)
router.post('/import-excel', upload.single('file'), importLocationsFromExcel)

export default router
