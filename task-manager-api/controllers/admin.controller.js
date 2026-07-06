import Task from "../models/tasks.model.js";

export const getAdminStats = async (req, res, next) => {
    try {
        const totalTasks = await Task.countDocuments();

        const statusStats = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    },
                },
            },
        ]);

        const priorityStats = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count:{
                        $sum: 1
                    },
                },
            },
        ]);

        const overdue = await Task.aggregate([
            {
                $match: {
                    dueDate: {
                        $lt: new Date()
                    },
                    status: {
                        $ne: "completed"
                    },
                },
            },
            {
                $count: "count"
            }
        ]);

        const byStatus = statusStats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const byPriority = priorityStats.reduce((acc,item)=>{
            acc[item._id]=item.count;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                byStatus,
                byPriority,
                overdueCount: overdue.length ? overdue[0].count : 0
            }
        });

    } catch (error) {
        next(error);
    }
}