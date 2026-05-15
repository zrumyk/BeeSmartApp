const { VetTask, Hive, User } = require("../models");
const ApiError = require("../utils/ApiError");

const createVetTask = async (payload) => {
  const [hiveExists, assignee] = await Promise.all([
    Hive.exists({ _id: payload.hive_id }),
    User.findById(payload.assigned_to)
  ]);

  if (!hiveExists) {
    throw new ApiError(404, "Hive not found");
  }

  if (!assignee) {
    throw new ApiError(404, "Assigned user not found");
  }

  if (assignee.role !== "beekeeper") {
    throw new ApiError(400, "Vet task can only be assigned to beekeeper");
  }

  return VetTask.create(payload);
};

const getMyTasksForToday = async (userId) => {
  return VetTask.find({
    assigned_to: userId,
    status: "pending"
  })
    .populate("hive_id", "qr_code type status location_id")
    .sort({ due_date: 1, createdAt: -1 });
};

const getAllTasks = async () =>
  VetTask.find()
    .populate("hive_id", "qr_code type status location_id")
    .populate("assigned_to", "name email role")
    .sort({ due_date: 1, createdAt: -1 });

const completeTask = async (taskId, user) => {
  const task = await VetTask.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Vet task not found");
  }

  if (user.role === "beekeeper" && String(task.assigned_to) !== String(user._id)) {
    throw new ApiError(403, "You can complete only your own tasks");
  }

  task.status = "completed";
  await task.save();
  return task;
};

module.exports = {
  createVetTask,
  getAllTasks,
  getMyTasksForToday,
  completeTask
};
