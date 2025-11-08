import express from 'express'
import {
  getAllContacts,
  getContactsByMilitaryRegion,
  getContactsByProvince,
  getContactsByWard,
  addContact,
  updateContact,
  deleteContact,
  deleteMultipleContacts,
  importContactsFromExcel,
  exportExcel,
  exportVcard,
} from '../controllers/contactsController.js'
import multer from 'multer'

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.get('/', getAllContacts)
router.get('/military-region', getContactsByMilitaryRegion)
router.get('/province', getContactsByProvince)
router.get('/ward', getContactsByWard)
router.post('/', addContact)
router.put('/:btlhcm_lh_malh', updateContact)
router.delete('/bulk/delete', deleteMultipleContacts)
router.delete('/:btlhcm_lh_malh', deleteContact)
router.post('/import-excel', upload.single('file'), importContactsFromExcel)
router.get('/export-excel', exportExcel)
router.get('/export-vcard', exportVcard)
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  console.log('req.file', req.file.filename)
  // trả về đường dẫn để client lưu vào DB
  res.json({ filePath: `/uploads/${req.file.filename}` })
})

export default router
