import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    decoratorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    eventLocation: {
        address: { type: String, required: true },
        city: { type: String, default: '' },
        zip: { type: String, default: '' }
    },
    bookingNotes: {
        type: String,
        trim: true
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
    }
}, {
    timestamps: true
});

export const Booking = mongoose.model('Booking', BookingSchema);