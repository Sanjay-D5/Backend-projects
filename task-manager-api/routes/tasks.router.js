import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { assignTask, createTask, deleteTask, getAllTasks, getTask, updateTask } from "../controllers/tasks.controller.js";
import requireRole from "../middlewares/role.middleware.js";



const taskRouter = Router();

taskRouter.post("/", authMiddleware, createTask);
taskRouter.get("/", authMiddleware, getAllTasks);
taskRouter.get("/:id", authMiddleware, getTask);
taskRouter.put("/:id", authMiddleware, updateTask);
taskRouter.delete("/:id", authMiddleware, requireRole("admin"), deleteTask);
taskRouter.put("/:id/assign", authMiddleware, requireRole("admin"), assignTask);

export default taskRouter;