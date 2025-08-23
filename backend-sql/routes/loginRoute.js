import express from 'express'
import { userLogin, userLogout } from '../controllers/loginController.js'

const router = express.Router()

router.post('/', userLogin)
router.post('/logout', userLogout)

export default router
