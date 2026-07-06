import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";
import { getAdminStats } from "../controllers/admin.controller.js";


const adminRouter = Router();

adminRouter.get("/stats", authMiddleware, requireRole("admin"), getAdminStats);

export default adminRouter;