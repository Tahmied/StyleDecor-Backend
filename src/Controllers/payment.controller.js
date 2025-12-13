import Stripe from "stripe";
import { asyncHandler } from "../Utils/AsyncHandler";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const CreateCheckoutSession = asyncHandler(async (req, res) => {
    const { serviceName, price, image, serviceId, userId, date, location, additionalNotes } = req.body;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: serviceName
                    },
                    unit_amount: Math.round(price * 100)
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URI}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URI}/services/${serviceId}`,
        
        metadata: {
            serviceId,
            userId,
            price,
            date,         
            location,     
            additionalNotes: additionalNotes || "",
            serviceName    
        }
    });

    return res.status(200).json({ url: session.url, id: session.id });
});
