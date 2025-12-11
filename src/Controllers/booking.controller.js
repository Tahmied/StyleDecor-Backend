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

    return res.status(201).json(
        new ApiResponse(201, booking, "Service booked successfully")
    );
});