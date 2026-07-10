import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { deleteResume, getResume, uploadResume } from "../controllers/upload.controller.js";

const resumeRoutes = Router();

resumeRoutes.post("/resume", authMiddleware, uploadResume);
resumeRoutes.get("/resume", authMiddleware, getResume);
resumeRoutes.delete("/resume", authMiddleware, deleteResume);

export default resumeRoutes;