import { Router } from 'express'
import { googleAuth, loginCheck, loginUser, logoutUser, registerUser, updateProfile } from '../Controllers/user.controller.js'
import { findUser } from '../Middlewares/auth.middleware.js'
import { mediaUpload } from '../Middlewares/multer.middleware.js'

const router = Router()

router.post('/register', mediaUpload('/dp').single('image') , registerUser)
router.post('/login', loginUser)
router.post('/logout', findUser, logoutUser)
router.get('/me', findUser, loginCheck)
router.post('/google-auth', googleAuth)


router.post('/update-profile', findUser, updateProfile)

export default router