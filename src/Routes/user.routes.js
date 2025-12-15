import { Router } from 'express'
import { getDecoratorStats, UserUpdateBookingStatus } from '../Controllers/booking.controller.js'
import { editUser, getCurrentUser, googleAuth, loginUser, logoutUser, profileDetails, registerUser, topDecorators, updateProfile } from '../Controllers/user.controller.js'
import { findUser, ifAdmin } from '../Middlewares/auth.middleware.js'
import { mediaUpload } from '../Middlewares/multer.middleware.js'

const router = Router()

router.post('/register', mediaUpload('/dp').single('image') , registerUser)
router.post('/login', loginUser)
router.post('/logout', findUser, logoutUser)
router.get('/me', findUser, getCurrentUser)
router.post('/google-auth', googleAuth)


router.post('/update-profile', findUser, mediaUpload('/dp').single('image'), updateProfile)
router.get('/profile', findUser, profileDetails)
router.post('/updateBookingStutes', findUser, UserUpdateBookingStatus)

router.get('/getDecorStates', findUser, getDecoratorStats)

router.post('/edit-user', ifAdmin, mediaUpload('/dp').single('image'), editUser)
router.get('/topDecor', topDecorators)

export default router