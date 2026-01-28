const { registerUser, loginUser, forgotPassword, resetPassword, getMe} = require("../services/auth.service");
const logger = require("../utils/logger");





const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await registerUser({ name, email, password });

    logger.info({ userId: user._id, email: user.email }, "User registered");


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const result = await loginUser({ email, password });
    logger.info({ userId: result.user._id, email: result.user.email }, "User logged in");

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const forgot = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const resetToken = await forgotPassword(email);
    logger.info({ email }, "Password reset requested");


    res.status(200).json({
      success: true,
      message: "Password reset token generated",
      resetToken, // temporary (later send via email)
    });
  } catch (error) {
    next(error);
  }
};


const reset = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      const error = new Error("New password is required");
      error.statusCode = 400;
      throw error;
    }

    const user = await resetPassword(token, newPassword);
    logger.info({ userId: user._id }, "Password reset successful");


    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};


module.exports = {
  register,
  login,
  forgot,
  reset,
  me,
};
