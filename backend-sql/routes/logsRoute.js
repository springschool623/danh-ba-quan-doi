import express from 'express'
import { getAllLogs, getLogById } from '../controllers/logsController.js'

const router = express.Router()

// Lấy tất cả logs (chỉ admin)
router.get('/', getAllLogs)

// Lấy log theo ID (chỉ admin)
router.get('/:id', getLogById)

export default router

