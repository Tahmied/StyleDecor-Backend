import { Router } from "express";
import { CreateCheckoutSession, myPayments, VerifyPaymentAndBook } from "../Controllers/payment.controller.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.post('/create-checkout-session', findUser, CreateCheckoutSession)
router.post('/verify-payment', findUser, VerifyPaymentAndBook)
router.get('/myPayments', findUser, myPayments)

export default router