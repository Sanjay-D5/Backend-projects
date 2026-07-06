import {body, validationResult} from 'express-validator';

export const registerValidation = [
    body("name")
        .trim()
        .isLength({min: 2, max: 50})
        .withMessage("Name must be between 2 and 50 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({min: 8})
        .withMessage("Password must be at least 8 characters"),
];

export const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

// we are using optional(), Because the user might update only 
export const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({min:2, max:50})
        .withMessage("Name must be between 2 and 50 characters"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
];


// This function runs after all validation rules. stops the request before it reaches the controller.
export const validate = (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(422).json({
            success: false,
            error: error.array(),
        });
    }

    next();
};