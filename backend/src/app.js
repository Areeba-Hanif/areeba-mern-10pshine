const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/auth.middleware");
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");


const app = express();

// Middlewares
app.use(pinoHttp({ logger }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);


// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});


app.use("/api/notes", noteRoutes);


// Error handling middleware (last)
app.use(errorHandler);

module.exports = app;
