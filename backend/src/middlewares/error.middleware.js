const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(
    {
      statusCode,
      path: req.originalUrl,
      method: req.method,
    },
    err.message
  );

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Something went wrong. Please try again."
        : err.message,
  });
};

module.exports = errorHandler;
