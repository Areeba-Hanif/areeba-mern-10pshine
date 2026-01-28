const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const logger = require("../utils/logger");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Not authorized, token missing");
      error.statusCode = 401;
      throw error;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user (without password)
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    logger.error(error);
    error.statusCode = 401;
    next(error);
  }
};

module.exports = { protect };

