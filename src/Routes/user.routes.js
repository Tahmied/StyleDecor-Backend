import { Router } from 'express'
import { getDecoratorStats, UserUpdateBookingStatus } from '../Controllers/booking.controller.js'
import { googleAuth, loginCheck, loginUser, logoutUser, profileDetails, registerUser, updateProfile } from '../Controllers/user.controller.js'
import { findUser } from '../Middlewares/auth.middleware.js'
import { mediaUpload } from '../Middlewares/multer.middleware.js'

const router = Router()

router.post('/register', mediaUpload('/dp').single('image') , registerUser)
router.post('/login', loginUser)
router.post('/logout', findUser, logoutUser)
router.get('/me', findUser, loginCheck)
router.post('/google-auth', googleAuth)


router.post('/update-profile', findUser, mediaUpload('/dp').single('image'), updateProfile)
router.get('/profile', findUser, profileDetails)
router.post('/updateBookingStutes', findUser, UserUpdateBookingStatus)

router.get('/getDecorStates', findUser, getDecoratorStats)

export default router