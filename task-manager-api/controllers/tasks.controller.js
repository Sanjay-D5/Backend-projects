import Task from "../models/tasks.model.js";
import User from "../models/users.model.js";

export const createTask = async (req, res, next) => {
    try {
        const {title, description, dueDate, priority} = req.body;

        const task = await Task.create({
            title, description, dueDate, priority, owner: req.user.id, assignedTo: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
};

export const getAllTasks = async (req, res, next) => {

    try {
        const {page = 1, limit = 10, status, priority, sortBy = "createdAt", order = "desc"} = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const filter = {};

        if(req.user.role !== "admin"){
            filter.owner = req.user.id;
        }

        if(status){
            filter.status = status;
        }

        if(priority){
            filter.priority = priority;
        }

        const sort = {
            [sortBy]: order === "asc" ? 1 : -1,
        };

        const total = await Task.countDocuments(filter);

        const tasks = await Task.find(filter)
            .sort(sort)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate("owner", "name email")
            .populate("assignedTo", "name email");

        res.status(200).json({
            success: true,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            total,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const getTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id)
            .populate("owner", "name email")
            .populate("assignedTo", "name email");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        if (
            req.user.role !== "admin" &&
            task.owner._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this task."
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        if (
            req.user.role !== "admin" &&
            task.owner.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this task."
            });
        }

        const {title, description, status, priority, dueDate} = req.body;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully.",
            data: task
        });

    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};


export const assignTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        task.assignedTo = user._id;

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("owner", "name email")
            .populate("assignedTo", "name email");

        res.status(200).json({
            success: true,
            message: "Task assigned successfully.",
            data: updatedTask
        });

    } catch (error) {
        next(error);
    }
};