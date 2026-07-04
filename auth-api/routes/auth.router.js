import { Router } from "express";
import { loginValidation, registerValidation, updateProfileValidation, validate } from "../validators/auth.validator.js";
import { getProfile, login, logout, refreshAccessToken, register, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/ratelimit.middleware.js";


const userRouter = Router();

userRouter.post('/register', authLimiter, registerValidation, validate, register);
userRouter.post('/login', authLimiter, loginValidation, validate, login);
userRouter.get('/me', authMiddleware, getProfile);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", authMiddleware, logout);
userRouter.put("/me", authMiddleware, updateProfileValidation, validate, updateProfile);


export default userRouter;