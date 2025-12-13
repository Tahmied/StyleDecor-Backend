import { Package } from "../Models/package.model.js";
import { ApiError } from '../Utils/apiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { asyncHandler } from '../Utils/AsyncHandler.js';
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";

export const createPackage = asyncHandler(async (req, res) => {
    const { packageType, price, reversed, description } = req.body;

    if (!packageType || !price) {
        throw new ApiError(400, "Package Type and Price are required");
    }

    let mainImageUrl = "";
    let videoThumbnailUrl = "";
    let thumbnailUrls = [];

    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
        const mainImg = await uploadOnCloudinary(req.files.mainImage[0].path);
        mainImageUrl = mainImg?.url;
    } else {
        throw new ApiError(400, "Main image is required");
    }
    if (req.files && req.files.videoThumbnail && req.files.videoThumbnail[0]) {
        const vidThumb = await uploadOnCloudinary(req.files.videoThumbnail[0].path);
        videoThumbnailUrl = vidThumb?.url;
    }

    if (req.files && req.files.thumbnails && req.files.thumbnails.length > 0) {
        const uploadPromises = req.files.thumbnails.map(file => uploadOnCloudinary(file.path));
        const results = await Promise.all(uploadPromises);
        thumbnailUrls = results.map(res => res?.url).filter(url => url !== null);
    }

    const newPackage = await Package.create({
        packageType,
        price: Number(price), 
        mainImage: mainImageUrl,
        videoThumbnail: videoThumbnailUrl || "",
        thumbnails: thumbnailUrls,
        reversed: reversed === 'true',
        description: description || ""
    });

    return res.status(201).json(
        new ApiResponse(201, newPackage, "Package created successfully")
    );
});
