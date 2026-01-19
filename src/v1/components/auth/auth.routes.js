const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);

module.exports = router;
