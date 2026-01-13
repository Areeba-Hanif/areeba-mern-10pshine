const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  // Create user (password will be hashed by model)
  const user = await User.create({
    name,
    email,
    password,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );



  
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};



const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found with this email");
    error.statusCode = 404;
    throw error;
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();

  // Save user with new fields
  await user.save({ validateBeforeSave: false });

  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  // Hash the token to match DB
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find user with this token AND valid expiry
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400;
    throw error;
  }

  // Update password
  user.password = newPassword;

  // Clear reset fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
};