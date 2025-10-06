import express from 'express'
import {
  getAllRanks,
  createRank,
  updateRank,
} from '../controllers/ranksController.js'

const router = express.Router()

router.get('/', getAllRanks)
router.post('/', createRank)
router.put('/:btlhcm_cb_macb', updateRank)

export default router
