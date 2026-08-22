const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.use("/api/auth", authRoutes);

module.exports = app;