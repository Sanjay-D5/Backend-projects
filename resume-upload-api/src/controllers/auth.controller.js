import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import setTokenCookie from "../utils/setTokenCookie.js";

export const register = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new ApiError(409, "Email already registered");
    }

    const user = await User.create({name, email, password});

    const token = generateToken(user);

    setTokenCookie(res, token);

    return res.status(201).json(
        new ApiResponse(
            201, 
            {user, token},
            "User registered successfully"
        )
    );
});


export const login = asyncHandler(async(req, res) => {

    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password");

    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user);

    setTokenCookie(res, token);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user, 
                token,
            },
            "Login successful"
        )
    );
});

export const logout = asyncHandler(async(req, res) => {
    res.clearCookie("token");

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Logged out successfully"
        )
    );
});

export const getCurrentUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User fetched successfully"
        )
    );
});