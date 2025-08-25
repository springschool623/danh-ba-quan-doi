import express from 'express'
import { getAllCommittees } from '../controllers/committeesController.js'

const router = express.Router()

router.get('/', getAllCommittees)

export default router
