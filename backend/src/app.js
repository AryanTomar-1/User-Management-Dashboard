const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.route");

const app = express();

app.use(cors());
app.use(express.json());

// User routes
app.use('/users', userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
