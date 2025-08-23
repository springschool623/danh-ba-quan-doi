import express from 'express'
import {
  getAllContacts,
  getContactsByMilitaryRegion,
  getContactsByProvince,
  getContactsByWard,
  addContact,
} from '../controllers/contactsController.js'

const router = express.Router()

router.get('/', getAllContacts)
router.get('/military-region', getContactsByMilitaryRegion)
router.get('/province', getContactsByProvince)
router.get('/ward', getContactsByWard)
router.post('/', addContact)

export default router
