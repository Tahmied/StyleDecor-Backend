import Stripe from "stripe";
import { Booking } from "../Models/booking.model.js";
import { Payment } from "../Models/payment.model.js";
import { Service } from "../Models/service.model.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const CreateCheckoutSession = asyncHandler(async (req, res) => {
    const {
        serviceId,
        decoratorId,
        eventDate,
        eventTime,
        eventLocation,
        bookingNotes
    } = req.body;

    if (!serviceId || !decoratorId || !eventDate || !eventTime) {
        throw new ApiError(400, "Missing required booking details (Decorator, Date, Time, etc.)");
    }

    const service = await Service.findById(serviceId)
    if (!service) {
        throw new ApiError(500, 'unable to find the service to book')
    }
    const serviceName = service.serviceName
    const price = service.cost
    const userId = req.user._id
    const serviceCategory = service.serviceCategory

    if (!userId) {
        throw new ApiError(400, 'user must be logged in')
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
        cancel_url: `${process.env.FRONTEND_URI}/service/${serviceId}`,
        metadata: {
            userId: userId.toString(),
            decoratorId,
            serviceId,
            eventDate,
            eventTime,
            eventLocation: eventLocation || '',
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

        status: "pending",
        paymentStatus: "paid",
        transactionId: session.payment_intent
    });

    const newPayment = await Payment.create({
        transactionId: session.payment_intent,
        amount: session.amount_total / 100,
        serviceName: service.serviceName,
        customerId: customer._id,
        customerPhone: customer.phoneNumber || "N/A",
        bookingId: newBooking._id,
        status: 'paid',
        decoratorId: decorator._id
    })

    await User.findByIdAndUpdate(
        decorator._id,
        {
            $push: { unavailableDates: new Date(eventDate) }
        },
        { new: true }
    );
    const response = {
        newBooking: newBooking,
        newPayment: newPayment
    }
    return res.status(200).json(
        new ApiResponse(200, response, "Payment verified and complete booking created")
    );
});

export const myPayments = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, 'User must be logged in'); 
    }
    const paymentDetails = await Payment.find({ customerId: user._id })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, paymentDetails, 'Payment details fetched successfully')
    );
});

export const myDecorPay = asyncHandler(async (req,res)=>{
    const decorator = req.user
    if(!decorator){
        throw new ApiError(400 , 'decorator must be logged in')
    }

    const payments = await Payment.find({decoratorId:decorator._id}).sort({createdAt: -1})
    
    return res.status(200).json(
        new ApiResponse(200, payments, '')
    )
})

export const getAdminAnalytics = asyncHandler(async (req, res) => {
    const totalRevenue = await Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const monthlyRevenue = await Payment.aggregate([
        {
            $match: {
                status: 'paid',
                createdAt: { 
                    $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) 
                }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$amount" }
            }
        },
        { $sort: { "_id": 1 } } 
    ]);

    const serviceDemand = await Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } }, 
        {
            $group: {
                _id: "$serviceName", 
                count: { $sum: 1 }, 
                totalValue: { $sum: "$servicePrice" } 
            }
        },
        { $sort: { count: -1 } }, 
        { $limit: 5 }
    ]);

    const totalBookings = await Booking.countDocuments();
    const activeDecorators = await User.countDocuments({ role: 'decorator' });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
        name: monthNames[item._id - 1],
        revenue: item.revenue
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            totalRevenue: totalRevenue[0]?.total || 0,
            monthlyRevenue: formattedMonthlyRevenue,
            serviceDemand: serviceDemand.map(s => ({ name: s._id, value: s.count })),
            totalBookings,
            activeDecorators
        }, "Analytics fetched successfully")
    );
});