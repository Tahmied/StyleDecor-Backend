import { Booking } from "../Models/booking.model.js";
import { Service } from "../Models/service.model.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";

export const BookService = asyncHandler(async (req, res) => {
    const { decoratorId, serviceId, eventDate, eventTime, eventLocation, bookingNotes } = req.body;

    if (!decoratorId || !serviceId || !eventDate || !eventTime || !eventLocation || !eventLocation) {
        throw new ApiError(400, 'All required fields (including Event Address) are missing');
    }

    const customer = req.user;
    if (!customer) {
        throw new ApiError(401, 'Customer must be logged in to book a service');
    }

    const decorator = await User.findById(decoratorId);
    if (!decorator) {
        throw new ApiError(404, 'Unable to find the decorator');
    }

    const service = await Service.findById(serviceId);
    if (!service) {
        throw new ApiError(404, 'Service not found to book');
    }

    const booking = await Booking.create({
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
        servicePrice: service.cost,
        eventDate, eventTime,
        eventLocation,
        bookingNotes: bookingNotes || ""
    });

    await User.findByIdAndUpdate(
        decorator._id,
        {
            $push: { unavailableDates: eventDate }
        },
        { new: true }
    );

    return res.status(201).json(
        new ApiResponse(201, booking, "Service booked successfully")
    );
});

export const getAvailableDecorators = asyncHandler(async (req, res) => {
    const { date } = req.body;

    if (!date) {
        throw new ApiError(400, "Date is required (YYYY-MM-DD)");
    }
    const searchDate = new Date(date);

    const bookedDecorators = await Booking.find({
        eventDate: searchDate,
        paymentStatus: 'paid'
    }).distinct('decoratorId');

    const availableDecorators = await User.find({
        role: 'decorator',
        _id: { $nin: bookedDecorators }
    }).select('-password');

    return res.status(200).json(
        new ApiResponse(200, availableDecorators, 'Available decorators fetched successfully')
    );
})

export const updateBookingStatus = asyncHandler(async (req, res) => {
    const { bookingId, status } = req.body
    if (!bookingId || !status) {
        throw new ApiError(400, 'booking id and status are required')
    }

    const validStatuses = ['Assigned', 'cancelled', 'completed', 'in-progress']
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status provided")
    }

    const booking = await Booking.findById(bookingId)
    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    booking.status = status
    await booking.save()

    if (status === 'cancelled') {
        const dateString = new Date(booking.eventDate).toISOString().split('T')[0];

        await User.findByIdAndUpdate(booking.decoratorId, {
            $pull: { unavailableDates: dateString } 
        });
    }

    return res.status(200).json(
        new ApiResponse(200, booking, `Booking status updated to ${status}`)
    );

})

export const AllBookings = asyncHandler(async (req,res)=>{
    const bookings = await Booking.find()
    if(!bookings){
        throw new ApiError(500, 'bookings not found')
    }
    return res.status(200).json(
        new ApiResponse(200, bookings, 'all bookings fetched')
    )
})