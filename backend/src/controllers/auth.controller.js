const { registerUser, loginUser, forgotPassword, resetPassword,deleteUserAccount  } = require("../services/auth.service");
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
    res.status(201).json({ success: true, message: "User registered successfully", data: user });
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
    res.status(200).json({ success: true, message: "Login successful", data: result });
  } catch (error) {
    next(error);
  }
};

const forgot = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide an email" });
    }
    await forgotPassword(email);
    res.status(200).json({ success: true, message: "Recovery email sent!" });
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    const { token } = req.params; // Make sure your route is: /reset/:token
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Please provide a new password" });
    }

    await resetPassword(token, password);
    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    next(error);
  }
};
const me = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};


// controllers/authController.js
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Call the service function we just fixed
    await deleteUserAccount(userId);

    res.status(200).json({
      success: true,
      message: "Account and all associated data deleted successfully."
    });
  } catch (error) {
    next(error); 
  }
};


module.exports = { register, login, forgot, reset, me, deleteAccount };