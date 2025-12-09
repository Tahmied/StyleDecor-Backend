import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema({
    service_name: {
        type: String,
        required: [true, "Service name is required"],
        trim: true,
        index: true 
    },
    description: {
        type: String,
        required: [true, "Service description is required"],
        trim: true
    },
    cost: {
        type: Number,
        required: [true, "Cost is required"],
        min: [0, "Cost cannot be negative"]
    },
    unit: {
        type: String,
        required: [true, "Unit is required"], 
        trim: true
    },
    service_category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Decoration", "Lighting", "Catering", "Photography"], 
        trim: true
    },
    images: {
        type: [String], 
        default: []
    },
    createdByEmail: {
        type: String,
        required: [true, "Creator email is required"],
        lowercase: true,
        trim: true
    }
} , {
    timestamps: true
})

export const Service = mongoose.model('Service', ServiceSchema)
