import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15min
    max: 2,
    skipSuccessfulRequests: true,

    message: {
        success: false,
        message: "Too many authentication attempts. Try again later."
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({

    windowMs:15 * 60 * 1000,

    max:100,

    message:{
        success:false,
        message:"Too many requests.",
    },

    standardHeaders:true,
    legacyHeaders:false,
});