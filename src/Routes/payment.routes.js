import { Router } from "express";
import { CreateCheckoutSession } from "../Controllers/payment.controller";
import { findUser } from "../Middlewares/auth.middleware";

const router = Router

router.post('/create-checkout-session', findUser, CreateCheckoutSession)

export default router