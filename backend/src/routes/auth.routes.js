const express = require("express");
const { register, login, forgot, reset, me } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const protect = authMiddleware.protect;

const { register, login, forgot, reset, me, logout } = require("../controllers/auth.controller");

// Public Routes (No token needed)
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot);
router.post("/reset-password/:token", reset);
router.get("/me", protect, me);

module.exports = router;