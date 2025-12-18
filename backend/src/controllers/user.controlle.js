const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

async function createUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const payload = req.body || {};
    const newUser = await userService.createUser(payload);
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    // Handle duplicate email error from mongoose
    if (err.code && err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
}

module.exports = {
  createUser,
};