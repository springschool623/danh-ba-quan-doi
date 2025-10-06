import express from 'express'
import {
  getAllCommittees,
  createCommittee,
  updateCommittee,
} from '../controllers/committeesController.js'

const router = express.Router()

router.get('/', getAllCommittees)
router.post('/', createCommittee)
router.put('/:btlhcm_ba_mab', updateCommittee)

export default router
