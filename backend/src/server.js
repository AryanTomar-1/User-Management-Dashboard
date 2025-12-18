const app = require("./app");
require('dotenv').config();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('MONGO_URI not set; skipping MongoDB connection (endpoints will fail if used).');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
    return;
  }

  try {
    await mongoose.connect(mongoUri, { keepAlive: true });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}

start();
