import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Format the errors nicely to pinpoint exactly what failed
        const formattedErrors = errors.array().map(error => ({
            field: error.path,   // 'path' contains the field name (e.g., 'email', 'password')
            message: error.msg,
        }));

        // Pass the structured errors into ApiError
        throw new ApiError(
            400, 
            "Validation failed", 
            formattedErrors
        );
    }

    next();
};

export default validate;