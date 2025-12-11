import { Router } from "express";
import { BookService, getAvailableDecorators } from "../Controllers/booking.controller.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.post('/book-service', findUser, BookService)
router.post('/get-available-decors', findUser, getAvailableDecorators)

export default router