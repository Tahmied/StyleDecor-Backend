import { Router } from 'express'
import { loginUser, logoutUser, registerUser } from '../Controllers/user.controller.js'
import { findUser } from '../Middlewares/auth.middleware.js'
import { mediaUpload } from '../Middlewares/multer.middleware.js'

const router = Router()

router.post('/register', mediaUpload('/dp').single('image') , registerUser)
router.post('/login', loginUser)
router.post('/logout', findUser, logoutUser)

export default router