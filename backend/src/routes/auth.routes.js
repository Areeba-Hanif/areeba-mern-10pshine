const express = require("express");
const { register, login, forgot ,reset } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot);
router.post("/reset-password/:token", reset);


module.exports = router;
