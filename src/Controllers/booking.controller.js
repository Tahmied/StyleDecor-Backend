import { Booking } from "../Models/booking.model.js";
import { Service } from "../Models/service.model.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";

export const BookService = asyncHandler(async (req, res) => {
    const { decoratorId, serviceId, eventDate, eventTime, eventLocation, bookingNotes, serviceCategory } = req.body;

    if (!decoratorId || !serviceId || !eventDate || !eventTime) {
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
        bookingNotes: bookingNotes || "",
        serviceCategory
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

    if (status === 'Assigned') {
        const updatedDecorator = await User.findByIdAndUpdate(
            booking.decoratorId,
            {
                $inc: {
                    totalEarnings: booking.servicePrice
                },

                $push: {
                    earningsHistory: {
                        amount: booking.servicePrice,

                        date: new Date(),
                        bookingId: booking._id,
                        description: `Payment for ${booking.serviceName}`
                    }
                }
            },
            { new: true }
        )
    };

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

export const getDecoratorStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyEarnings = user.earningsHistory
        .filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth &&
                entryDate.getFullYear() === currentYear;
        })
        .reduce((sum, entry) => sum + entry.amount, 0);

    const completedProjectsCount = await Booking.countDocuments({
        decoratorId: req.user._id,
        status: { $regex: /^completed$/i }
    });

    console.log(completedProjectsCount);

    return res.status(200).json({
        success: true,
        data: {
            totalEarnings: user.totalEarnings,
            thisMonthEarnings: monthlyEarnings,
            history: user.earningsHistory,
            completedProjectsCount
        }
    });
});

export const AllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
    if (!bookings) {
        throw new ApiError(500, 'bookings not found')
    }
    return res.status(200).json(
        new ApiResponse(200, bookings, 'all bookings fetched')
    )
})

export const MyBookings = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(404, 'user must be logged in')
    }

    const MyBookings = await Booking.find({
        customer: user._id
    })
    if (!MyBookings) {
        throw new ApiError('500', 'unable to find my bookings')
    }
    return res.status(200).json(
        new ApiResponse(200, MyBookings, 'my bookings fetched')
    )
})

export const UserUpdateBookingStatus = asyncHandler(async (req, res) => {
    const user = req.user
    const { bookingId, status } = req.body
    if (!user || !bookingId || !status) {
        throw new ApiError(400, 'user must be logged in')
    }

    const booking = await Booking.findById(bookingId)
    if (!booking) {
        throw new ApiError(404, 'no bookings found for this id')
    }

    booking.status = status
    await booking.save()
    return res.status(200).json(
        new ApiResponse(200, 'booking status updated')
    )
})

export const MyServiceBookings = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(400, 'user must be logged in')
    }
    if (user.role !== 'decorator') {
        throw new ApiError(400, 'You are not a decorator')
    }

    const MyBookings = await Booking.find({
        decoratorId: user._id,
        status: { $ne: 'pending' }
    })
    if (!MyBookings) {
        throw new ApiError(500, 'unable to find your bookings')
    }

    return res.status(200).json(
        new ApiResponse(200, MyBookings, 'your bookings are fetched')
    )

})

export const getTodaysDecorSchedule = asyncHandler(async (req, res) => {
    const decoratorId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
        decoratorId: decoratorId,
        eventDate: {
            $gte: startOfDay,
            $lte: endOfDay
        },
        status: { $ne: 'cancelled' }
    }).populate("serviceId", "serviceName duration");

    return res.status(200).json(
        new ApiResponse(200, bookings, "Today's schedule fetched successfully")
    );
});

export const updateBookingDetails = asyncHandler(async (req, res) => {
    const { bookingId, eventDate, eventTime, eventLocation, bookingNotes } = req.body;
    const userId = req.user._id;

    if (!bookingId) {
        throw new ApiError(400, "Booking ID is required");
    }

    const booking = await Booking.findOne({ _id: bookingId, customer: userId });

    if (!booking) {
        throw new ApiError(404, "Booking not found or you are not authorized to edit it.");
    }

    if (['completed', 'cancelled'].includes(booking.status.toLowerCase())) {
        throw new ApiError(400, "Cannot edit a completed or cancelled booking.");
    }

    if (eventDate) {
        const newDateObj = new Date(eventDate);
        const oldDateObj = new Date(booking.eventDate);

        if (newDateObj.getTime() !== oldDateObj.getTime()) {

            const conflict = await Booking.findOne({
                decoratorId: booking.decoratorId,
                eventDate: newDateObj,
                _id: { $ne: booking._id }, 
                status: { $ne: 'cancelled' }
            });

            if (conflict) {
                throw new ApiError(400, "The decorator is not available on this new date. Please choose another date.");
            }

            await User.findByIdAndUpdate(booking.decoratorId, {
                $pull: { unavailableDates: oldDateObj },
                $push: { unavailableDates: newDateObj }
            });

            booking.eventDate = newDateObj;
        }
    }

    if (eventTime) booking.eventTime = eventTime;
    if (eventLocation) booking.eventLocation = eventLocation;
    if (bookingNotes) booking.bookingNotes = bookingNotes;

    await booking.save();

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking details updated successfully")
    );
});