const express = require("express");
const {
  register,
  login,
  forgot,
  reset,
  me,
  logout
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot);
router.post("/reset-password/:token", reset);

// Protected route
router.get("/me", protect, me);

module.exports = router;
