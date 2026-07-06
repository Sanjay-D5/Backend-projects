import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/env.js";

// verify a token
const authMiddleware = (req, res, next) => {
    try {
        // Read Authorization Header
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;