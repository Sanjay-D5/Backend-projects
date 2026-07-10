import { Router } from "express";
import {register, login, logout, getCurrentUser} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { loginValidation, registerValidation } from "../validators/auth.validator.js";
import validate from "../middlewares/validation.middleware.js";

const authRouter = Router();

authRouter.post("/register",registerValidation, validate, register);
authRouter.post("/login", loginValidation, validate, login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/me", authMiddleware, getCurrentUser);

export default authRouter;