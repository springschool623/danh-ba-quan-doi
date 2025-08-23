import express from 'express'
import { getAllWards, getWardsById } from '../controllers/wardsController.js'

const router = express.Router()

router.get('/', getAllWards)
router.get('/:id', getWardsById)

export default router
