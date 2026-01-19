const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authController = require("../auth/auth.controller");

router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers,
);
router.get(
  "/:id",
  authController.protect,
  userController.getUser,
);
router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteUser,
);

router.patch(
  "/role",
  authController.protect,
  authController.restrictTo("admin"),
  userController.updateUserRole,
);

module.exports = router;
