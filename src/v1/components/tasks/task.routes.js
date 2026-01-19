const express = require('express');
const router = express.Router();
const authController = require('../auth/auth.controller');
const taskController = require('./task.controller');



router.post(
  '/',
  authController.protect,
  taskController.createTask
);

router.get(
  '/',
  authController.protect,
  taskController.getAllTasks
);

router.get(
  '/stats',
  authController.protect,
  taskController.getTaskStats
);

router.get(
  '/:id',
  authController.protect,
  taskController.canViewTask,
  taskController.getTask
);

router.patch(
  '/:id',
  authController.protect,
  taskController.updateTask
);



module.exports = router;