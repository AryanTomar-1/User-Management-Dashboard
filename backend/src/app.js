const express = require("express");
const cors = require("cors");
const nameRoutes = require("./routes/nameRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
