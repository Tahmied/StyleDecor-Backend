import Stripe from "stripe";
import { Booking } from "../Models/booking.model";
import { Service } from "../Models/service.model";
import { User } from "../Models/user.model";
import { asyncHandler } from "../Utils/AsyncHandler";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const CreateCheckoutSession = asyncHandler(async (req, res) => {
    const { 
        serviceId, 
        decoratorId,
        eventDate, 
        eventTime,  
        eventLocation, 
        bookingNotes,
        serviceName, 
        price, 
        image, 
        userId,
        serviceCategory
    } = req.body;

    if (!serviceId || !decoratorId || !eventDate || !eventTime || !userId) {
        throw new ApiError(400, "Missing required booking details (Decorator, Date, Time, etc.)");
    }

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
            userId,           
            decoratorId,      
            serviceId,      
            eventDate,
            eventTime,
            eventLocation,
            serviceCategory,
            bookingNotes: bookingNotes || "",
            price
        }
    });

    return res.status(200).json({ url: session.url, id: session.id });
});

export const VerifyPaymentAndBook = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) throw new ApiError(400, "Session ID is required");

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
        throw new ApiError(400, "Payment not verified");
    }
    
    const existingBooking = await Booking.findOne({ transactionId: session.payment_intent });
    if (existingBooking) {
        return res.status(200).json(new ApiResponse(200, existingBooking, "Booking already exists"));
    }

    const { 
        userId, 
        decoratorId, 
        serviceId, 
        eventDate, 
        eventTime, 
        eventLocation, 
        bookingNotes, 
        serviceCategory 
    } = session.metadata;


    const customer = await User.findById(userId);
    const decorator = await User.findById(decoratorId);
    const service = await Service.findById(serviceId);

    if (!customer || !decorator || !service) {
        throw new ApiError(404, "Data missing for paid booking.");
    }

    const newBooking = await Booking.create({
        customer: customer._id,
        customerName: customer.name,
        customerImage: customer.image || "",
        customerPhoneNumber: customer.phoneNumber || "",
        
        decoratorId: decorator._id,
        decoratorName: decorator.name,
        decoratorNum: decorator.phoneNumber || "",
        decoratorImage: decorator.image || "",
        
        serviceId: service._id,
        serviceName: service.serviceName,
        servicePrice: session.amount_total / 100, 
        serviceCategory: serviceCategory,
        
        eventDate: new Date(eventDate), 
        eventTime: eventTime,
        eventLocation: eventLocation,
        bookingNotes: bookingNotes,
        
        status: "Assigned", 
        paymentStatus: "paid",
        transactionId: session.payment_intent 
    });

    await User.findByIdAndUpdate(
        decorator._id,
        {
            $push: { unavailableDates: new Date(eventDate) }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, newBooking, "Payment verified and complete booking created")
    );
});