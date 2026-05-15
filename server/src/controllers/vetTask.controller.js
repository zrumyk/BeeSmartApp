const asyncHandler = require("../middlewares/asyncHandler.middleware");
const vetTaskService = require("../services/vetTask.service");

const createVetTask = asyncHandler(async (req, res) => {
  const task = await vetTaskService.createVetTask(req.body);
  res.status(201).json({
    success: true,
    message: "Vet task created successfully",
    data: task
  });
});

const getAllVetTasks = asyncHandler(async (req, res) => {
  const tasks = await vetTaskService.getAllTasks();
  res.status(200).json({
    success: true,
    data: tasks
  });
});

const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await vetTaskService.getMyTasksForToday(req.user._id);
  res.status(200).json({
    success: true,
    data: tasks
  });
});

const completeVetTask = asyncHandler(async (req, res) => {
  const task = await vetTaskService.completeTask(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: "Task marked as completed",
    data: task
  });
});

module.exports = {
  createVetTask,
  getAllVetTasks,
  getMyTasks,
  completeVetTask
};
