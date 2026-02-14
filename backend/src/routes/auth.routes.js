const express = require("express");
const { register, login, forgot, reset, me ,deleteAccount,update} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot);
router.post("/reset-password/:token", reset);
router.get("/me", protect, me);
router.delete('/delete-account', protect, deleteAccount);
router.patch("/update-profile", protect, update);


module.exports = router;
