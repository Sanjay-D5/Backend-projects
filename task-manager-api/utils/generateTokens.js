import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from './token.utils.js';
import {refreshCookieOptions} from "./cookieOptions.js"

const generateToken = async (user, res) => {
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);


    // Prevent password validation issues when saving
    await user.save({ validateBeforeSave: false });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return accessToken;
};

export default generateToken;