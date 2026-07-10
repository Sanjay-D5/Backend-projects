import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the account still exists in database.
    const user = await User.findById(decoded.id);

    if(!user){
        throw new ApiError(401, "User not found");
    }

    // we perform one database query in the middleware, and every protected controller can immediately access all user data.
    req.user = user;

    next();
});

export default authMiddleware;