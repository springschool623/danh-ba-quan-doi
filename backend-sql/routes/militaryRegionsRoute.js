import express from 'express'
import {
  getAllMilitaryRegions,
  getMilitaryRegionsById,
} from '../controllers/militaryRegionsController.js'

const router = express.Router()

router.get('/', getAllMilitaryRegions)
router.get('/:id', getMilitaryRegionsById)

export default router
