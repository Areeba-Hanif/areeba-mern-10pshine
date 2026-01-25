const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");

const app = express();

// Middlewares

app.use(
  pinoHttp({
    redact: {
      paths: ["req.headers.authorization",
         "req.headers.cookie"
      ],
      remove: true
    }
  })
);
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Basic Error handling middleware (Added inline for now)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;