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

export const getAllPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find().sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, packages, "Packages fetched successfully")
    );
});

export const deletePackage = asyncHandler(async (req, res) => {
    const { packageId } = req.body; 

    const pkg = await Package.findById(packageId);
    if (!pkg) {
        throw new ApiError(404, "Package not found");
    }
    const getPublicId = (url) => {
        if (!url) return null;
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        const folderName = parts[parts.length - 2]; 
        return `${folderName}/${fileName.split('.')[0]}`;
    };

    if (pkg.mainImage) await deleteFromCloudinary(getPublicId(pkg.mainImage));
    
    if (pkg.videoThumbnail) await deleteFromCloudinary(getPublicId(pkg.videoThumbnail));

    if (pkg.thumbnails.length > 0) {
        for (const url of pkg.thumbnails) {
            await deleteFromCloudinary(getPublicId(url));
        }
    }

    await Package.findByIdAndDelete(packageId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Package deleted successfully")
    );
});

