const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const protect = authMiddleware.protect;

const { register, login, forgot, reset, me, logout } = require("../controllers/auth.controller");

// Public Routes (No token needed)
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot);
router.post("/reset-password/:token", reset);

// Private Routes (Token required)
router.get("/me", protect, me);
router.post("/logout", protect, logout);

module.exports = router;