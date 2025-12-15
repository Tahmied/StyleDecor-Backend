import { Router } from "express";
import { CreateCheckoutSession, getAdminAnalytics, myDecorPay, myPayments, VerifyPaymentAndBook } from "../Controllers/payment.controller.js";
import { findUser, ifAdmin } from "../Middlewares/auth.middleware.js";

const router = Router()

router.post('/create-checkout-session', findUser, CreateCheckoutSession)
router.post('/verify-payment', findUser, VerifyPaymentAndBook)
router.get('/myPayments', findUser, myPayments)
router.get('/myDecorPay', findUser, myDecorPay)
router.get('/analytics', ifAdmin, getAdminAnalytics)

export default router