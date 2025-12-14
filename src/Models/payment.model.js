import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true, 
            index: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "bdt", 
            uppercase: true 
        },
        serviceName: {
            type: String,
            required: true,
            trim: true
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },
        status: {
            type: String,
            default: "paid"
        },
        paymentDate: {
            type: Date,
            default: Date.now 
        }
    },
    {
        timestamps: true 
    }
);

export const Payment = mongoose.model("Payment", PaymentSchema);