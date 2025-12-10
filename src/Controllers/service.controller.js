import fs from 'fs';
import { Service } from "../Models/service.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from '../Utils/ApiResponse.js';
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { uploadOnCloudinary } from '../Utils/Cloudinary.js';

export const addService = asyncHandler(async (req, res) => {
    const admin = req.admin
    console.log(admin);

    const {
        serviceName,
        description,
        longDescription,
        duration,
        serviceType,
        cost,
        unit,
        serviceCategory, features, includes
    } = req.body;

    if (
        [serviceName, description, longDescription, duration, cost, unit, serviceCategory].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }


    let imageUrls = [];

    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file) => {
            try {
                const response = await uploadOnCloudinary(file.path);
                return response?.url;
            } catch (error) {
                console.log(error);
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        imageUrls = results.filter((url) => url !== null);
    }
    if (imageUrls.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }

    const service = await Service.create({
        serviceName,
        description,
        longDescription,
        duration,
        serviceType,
        features: features || [],
        includes: includes || [],
        cost,
        unit,
        serviceCategory,
        images: imageUrls, createdByEmail: admin.email
    });

    if (!service) {
        throw new ApiError(500, "Something went wrong while creating the service");
    }

    return res.status(201).json(
        new ApiResponse(200, service, "Service created successfully")
    );
});

export const editService = asyncHandler(async (req, res) => {
    const { serviceId } = req.body;

    if (!serviceId) {
        throw new ApiError(400, 'Service ID is required');
    }

    const service = await Service.findById(serviceId);

    if (!service) {
        throw new ApiError(404, "Service not found");
    }

    const {
        serviceName,
        description,
        longDescription,
        duration,
        serviceType,
        cost,
        unit,
        serviceCategory,
        features,
        includes
    } = req.body;

    if (serviceName) service.serviceName = serviceName;
    if (description) service.description = description;
    if (longDescription) service.longDescription = longDescription;
    if (duration) service.duration = duration;
    if (serviceType) service.serviceType = serviceType;
    if (cost) service.cost = cost;
    if (unit) service.unit = unit;
    if (serviceCategory) service.serviceCategory = serviceCategory;

    if (features) {
        service.features = typeof features === 'string' ? JSON.parse(features) : features;
    }
    if (includes) {
        service.includes = typeof includes === 'string' ? JSON.parse(includes) : includes;
    }
    
    const updatedService = await service.save();

    return res.status(200).json(
        new ApiResponse(200, updatedService, 'Service updated successfully')
    );
});