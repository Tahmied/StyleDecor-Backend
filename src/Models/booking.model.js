import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: false,
        trim: true
    },
    customerImage: {
        type: String
    },
    customerPhoneNumber: {
        type: String
    },
    decoratorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceCategory: {
        type: String,
        required: false
    },
    decoratorName: {
        type: String,
        required: false,
        trim: true
    },
    decoratorNum: {
        type: String,
        required: false
    },
    decoratorImage: {
        type: String
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    servicePrice: {
        type: Number,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    eventLocation: {
        type: String,
        required: false
    },
    bookingNotes: {
        type: String,
        trim: true,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', "Assigned", "Planning Phase", "Materials Prepared", "On the Way to Venue", "Setup in Progress", "Completed"],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    transactionId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Booking = mongoose.model('Booking', BookingSchema);