const User = require("../models/user.model");
const Note = require("../models/note.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
    const error = new Error("No user found with that email");
    error.statusCode = 404;
    throw error;
  }

  // 1. Generate Plain Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash and Save to User
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins from now

  console.log("Saving Expiry to DB:", user.resetPasswordExpires); 
  await user.save();

  // 3. Create Reset URL
  // Ensure FRONTEND_URL is set in your .env (e.g., http://localhost:5173)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  // 4. Email Template
  const message = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Please click the link below to set a new password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  // 5. SEND THE EMAIL (This was missing!)
  try {
    await sendEmail({
      email: user.email,
      subject: "BrainDump - Password Reset Request",
      message,
    });
    console.log("✅ Email sent successfully to:", user.email);
  } catch (err) {
    // If email fails, clean up the DB fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    console.error("❌ Email failed to send:", err);
    const error = new Error("Email could not be sent. Please try again later.");
    error.statusCode = 500;
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  // 1. Hash the token from the URL
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // 2. Find user with matching hash and unexpired time
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    // Debugging logic
    const userCheck = await User.findOne({ resetPasswordToken: hashedToken });
    if (!userCheck) {
      console.log("❌ REASON: Hashed token not found in database.");
    } else {
      console.log("❌ REASON: Token exists but is EXPIRED.");
    }
    
    const error = new Error("Invalid or expired token");
    error.statusCode = 400;
    throw error;
  }

  // 3. Update Password & Clear Reset Fields
  user.password = newPassword; 
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  await user.save();
  console.log("✅ Password successfully updated for:", user.email);
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
const deleteUserAccount = async (userId, password) => {
  // 1. Find the user including the password field
  const user = await User.findById(userId).select("+password");
  
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. VERIFY the password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Incorrect password. Deletion aborted.");
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  try {
    // 3. Delete notes associated with the user
    await Note.deleteMany({ user: userId });
    
    // 4. Delete the user
    await User.findByIdAndDelete(userId);
    
    return { success: true };
  } catch (err) {
    throw err;
  }
};

const updateProfileService = async (userId, { name, currentPassword, nextPassword }) => {
  // 1. Fetch user (must include password for comparison)
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found");

  // 2. Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error("Current password incorrect");
    error.statusCode = 401;
    throw error;
  }

  // 3. Update fields
  if (name) user.name = name;
  
  if (nextPassword) {
    // Just set the plain text password; 
    // your User model's .pre('save') middleware will hash it.
    user.password = nextPassword;
  }

  // 4. Save and return
  // If this line fails (500 error), check your User model validation rules
  await user.save(); 

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};



module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  deleteUserAccount,
  updateProfileService,
};