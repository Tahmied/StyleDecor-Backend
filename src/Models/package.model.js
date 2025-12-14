import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema(
    {
        packageName: {
            type: String,
            required: [true, "Package type/name is required"], 
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0
        },
        mainImage: {
            type: String,
            required: true 
        },
        videoThumbnail: {
            type: String, 
            required: false 
        },
        videoUrl: {
            type: String,
            required:false
        },
        thumbnails: {
            type: [String],
            default: []
        },
        description: {
            type: String,
            trim: true 
        },
        serviceLink: {
            type: String,
            trim:true
        }
    },
    {
        timestamps: true
    }
);

export const Package = mongoose.model("Package", packageSchema);