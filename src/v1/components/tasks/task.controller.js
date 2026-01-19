const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");
const Task = require("./task.model");
const User = require("../users/user.model");
const mongoose = require("mongoose");

exports.createTask = catchAsync(async (req, res, next) => {
  const creatorId = req.user.id;

  if (req.body.assignee) {
    const assigneeExists = await User.findById(req.body.assignee);

    if (!assigneeExists) {
      return next(new AppError("Assignee user not found", 404));
    }
  }

  const taskData = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    assignee: req.body.assignee || null,
    user: creatorId,
  };

  const task = await Task.create(taskData);

  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const { status, priority, search } = req.query;

  // 1) Base filter according to role
  let filter = {};

  if (req.user.role !== "admin") {
    filter.$or = [{ user: req.user.id }, { assignee: req.user.id }];
  }

  // 2) Apply status filter
  if (status) {
    filter.status = status;
  }

  // 3) Apply priority filter
  if (priority) {
    filter.priority = priority;
  }

  // 4) Apply search on title & description
  if (search) {
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    ];
  }

  const tasks = await Task.find(filter)
    .populate("user", "name email")
    .populate("assignee", "name email")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  // 1) Find task + populate useful fields
  const task = await Task.findById(req.params.id)
    .populate("user", "name email")
    .populate("assignee", "name email");

  // 2) Task exists?
  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  // 3) Authorization checks
  const isCreator = task.user._id.toString() === req.user.id;

  const isAssignee =
    task.assignee && task.assignee._id.toString() === req.user.id;

  const isAdmin = req.user.role === "admin";

  if (!(isCreator || isAssignee || isAdmin)) {
    return next(new AppError("You are not allowed to view this task", 403));
  }

  // 4) Allowed → return task
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.canViewTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  const isCreator = task.user.toString() === req.user.id;

  const isAssignee = task.assignee?.toString() === req.user.id;

  const isAdmin = req.user.role === "admin";

  if (!(isCreator || isAssignee || isAdmin)) {
    return next(new AppError("Not authorized to view this task", 403));
  }

  req.task = task;
  next();
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  const isCreator = task.user.toString() === req.user.id;

  const isAssignee = task.assignee?.toString() === req.user.id;

  const isAdmin = req.user.role === "admin";

  if (!(isCreator || isAssignee || isAdmin)) {
    return next(new AppError("No permission", 403));
  }

  let updateData = {};

  if (isCreator || isAdmin) {
    updateData = req.body;
  } else if (isAssignee) {
    updateData = {
      status: req.body.status,
    };
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.json({
    status: "success",
    data: updated,
  });
});

exports.getTaskStats = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  let matchStage = {};

  if (req.user.role !== "admin") {
    matchStage = {
      $or: [{ user: userId }, { assignee: userId }],
    };
  }

  // 2) Aggregation pipeline
  const stats = await Task.aggregate([
    // Filter by role
    { $match: matchStage },

    // Group all statistics
    {
      $group: {
        _id: null,

        totalTasks: { $sum: 1 },

        completed: {
          $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
        },

        pending: {
          $sum: { $cond: [{ $ne: ["$status", "done"] }, 1, 0] },
        },

        lowPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] },
        },

        mediumPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] },
        },

        highPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: stats[0] || {
      totalTasks: 0,
      completed: 0,
      pending: 0,
      lowPriority: 0,
      mediumPriority: 0,
      highPriority: 0,
    },
  });
});
