import express from 'express'
import { getAllLocations } from '../controllers/locationsController.js'

const router = express.Router()

router.get('/', getAllLocations)

export default router
