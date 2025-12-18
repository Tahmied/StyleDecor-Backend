import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: false,
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'decorator'],
        default: 'user'
    },
    specialty: {
        type: String,
        enum: ['Wedding', 'Birthday', 'Corporate', 'Home', 'Seasonal', 'All'],
        default: 'All'
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    earnings: {
        type: Number,
        default: 0
    },
    createdByEmail: {
        type: String,
        unique: false,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    unavailableDates: [{
        type: String
    }],
    totalEarnings: {
        type: Number,
        default: 0
    },
    earningsHistory: [
        {
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
            bookingId: { type: Schema.Types.ObjectId, ref: "Booking" }
        }
    ],
    isFeaturedDecorator: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.isPassCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', UserSchema);