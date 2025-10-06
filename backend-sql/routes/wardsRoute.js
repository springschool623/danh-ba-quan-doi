import express from 'express'
import multer from 'multer'
import {
  getAllWards,
  getWardsById,
  getWardByUser,
  importWardsFromExcel,
  addWard,
  updateWard,
  setWardByUserRole,
} from '../controllers/wardsController.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/', getAllWards)
router.get('/:id', getWardsById)
router.get('/user/:btlhcm_nd_mand', getWardByUser)
router.post('/', addWard)
router.put('/:btlhcm_px_mapx', updateWard)
router.post('/import-excel', upload.single('file'), importWardsFromExcel)
router.post('/set-ward-by-user-role/:btlhcm_nd_mand', setWardByUserRole)

export default router
