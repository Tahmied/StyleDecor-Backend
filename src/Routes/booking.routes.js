import { Router } from "express";
import { AllBookings, BookService, getAvailableDecorators, MyBookings, updateBookingStatus } from "../Controllers/booking.controller.js";
import { findUser, ifAdmin } from "../Middlewares/auth.middleware.js";

const router = Router()

router.post('/book-service', findUser, BookService)
router.post('/get-available-decors', findUser, getAvailableDecorators)
router.post('/updateBookingStatus', ifAdmin, updateBookingStatus)
router.get('/allBookings', ifAdmin, AllBookings)

router.get('/my-bookings', findUser, MyBookings)

export default router