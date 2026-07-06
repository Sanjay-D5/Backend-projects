import bcrypt from "bcryptjs";
import User from "../models/users.model.js";
import generateToken from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, NODE_ENV } from "../config/env.js";
import { refreshCookieOptions } from "../utils/cookieOptions.js";


export const register = async (req, res, next) => {

    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        const newUser = await User.create({name, email, password});

        const accessToken = await generateToken(newUser, res);

        res.status(201).json({
            success: true,
            message: "Registered successfully!",
            accessToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const accessToken = await generateToken(user, res);

        res.status(200).json({
            success: true,
            message: "logged In successfully!",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });


    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next)=>{
    try{

        const user = await User.findById(req.user.id).select("-refreshToken");

        res.json({
            success:true,
            message: "User fetched successfully!",
            user
        });

    }
    catch(error){
        next(error);
    }
};

export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({
                success: false,
                message: "Refresh token missing",
            });
        }

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id).select("+refreshToken");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const accessToken = await generateToken(user, res);

        res.status(200).json({
            success: true,
            message: "refreshed successfully!",
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.refreshToken = null;

        // We're only updating one field: refreshToken - Skipping validation is slightly more efficient.
        await user.save({ validateBeforeSave: false});

        res.clearCookie("refreshToken", refreshCookieOptions);

        res.status(200).json({
            success: true,
            message: "Logged out successfuly",
        });

    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const {name, email} = req.body;

        if(name){
            user.name = name;
        }

        if(email){
            user.email = email;
        }

        const existingUser = await User.findOne({email});

        // This prevents duplicate emails.
        if(existingUser && existingUser._id.toString() !== user._id.toString()){
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Updated profile successfully!",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        next(error);
    }
}