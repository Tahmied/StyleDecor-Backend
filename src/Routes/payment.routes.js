import { Router } from "express";
import { CreateCheckoutSession, VerifyPaymentAndBook } from "../Controllers/payment.controller";
import { findUser } from "../Middlewares/auth.middleware";

const router = Router

router.post('/create-checkout-session', findUser, CreateCheckoutSession)
router.post('/verify-payment', findUser, VerifyPaymentAndBook)

export default router