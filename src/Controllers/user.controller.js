import dotenv from 'dotenv';
import { User } from '../Models/user.model.js';
import { ApiError } from '../Utils/apiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { asyncHandler } from '../Utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../Utils/Cloudinary.js';


dotenv.config({ path: './.env' })

async function generateAccessAndRefreshToken(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await User.findByIdAndUpdate(
            userId,
            { $set: { refreshToken } },
            { new: true, validateBeforeSave: false }
        );

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, `Token generation failed: ${err.message}`);
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        throw new ApiError(400, 'Name, email and password are required fields')
    }
    if (await User.findOne({ email })) {
        throw new ApiError(409, 'User already exists')
    }

    const CloudinaryResponse = await uploadOnCloudinary(req.file.path)
    const Image = CloudinaryResponse.url
    await User.create({
        name, email, password, image: Image
    })
    res.status(200).json(
        new ApiResponse(200, { message: 'User registered successfully' }, 'User registered successfully')
    )
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log(email, password);

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    const isPasswordValid = await user.isPassCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const updatedUser = await User.findById(user._id).select('-password -refreshToken')

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(200,
                {
                    user: updatedUser,
                    accessToken,
                    refreshToken
                },
                'Login successful'
            )
        )
})

export const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(400, 'Unable to find the user from tokens')
    }
    await User.findByIdAndUpdate(
        user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    return res
        .status(200)
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(
            new ApiResponse(200, { message: 'User logged out' }, 'User logout successfully')
        )
})

export const loginCheck = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(200).json(new ApiResponse(200, '', 'user is not logged in'))
    }
    const data = {
        email: user.email,
        fullName: user.fullName,
        accessToken: req.token,
        image: user.image
    }
    return res.status(200).json(new ApiResponse(200, data, 'user is logged in'))
})

export const userDetails = asyncHandler(async (req, res) => {
    let user = req.user
    if (!user) {
        throw new ApiError(400, 'user not found, please login again')
    }
    const data = {
        email: user.email,
        fullName: user.fullName,
        accessToken: req.token,
        image: user.image
    }
    return res.status(200).json(
        new ApiResponse(200, data)
    )
})

export const googleAuth = asyncHandler(async (req, res) => {
    const { email, name, image } = req.body
    let user = await User.findOne({ email })
    if (!user) {
        user = await User.create({
            name: name,
            email: email,
            image: image
        })
    }
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    return res.status(200).json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken, refreshToken
        }, 'google login synced successfully')
    )
})