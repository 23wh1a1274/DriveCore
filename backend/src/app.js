require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

module.exports = app;