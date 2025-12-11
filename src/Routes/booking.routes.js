import { Router } from "express";
import { BookService } from "../Controllers/booking.controller.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.post('/book-service', findUser, BookService)

export default router