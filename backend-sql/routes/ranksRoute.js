import express from 'express'
import { getAllRanks } from '../controllers/ranksController.js'

const router = express.Router()

router.get('/', getAllRanks)

export default router
