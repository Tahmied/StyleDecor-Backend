import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema({
    serviceName: {
        type: String,
        required: [true, "Service name is required"],
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    longDescription: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        default: "On-site",
        enum: ["On-site", "Remote", "In-studio"]
    },
    features: {
        type: [String], 
        default: []
    },
    includes: {
        type: [String], 
        default: []
    },
    cost: {
        type: Number,
        required: [true, "Cost is required"],
        min: [0, "Cost cannot be negative"]
    },
    unit: {
        type: String,
        default: "per service"
    },
    serviceCategory: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Decoration", "Lighting", "Catering", "Photography"],
        trim: true
    },
    images: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

export const Service = mongoose.model('Service', ServiceSchema)
