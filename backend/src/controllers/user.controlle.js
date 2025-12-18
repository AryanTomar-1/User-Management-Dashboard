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

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
}

async function getUserByMailId(req, res) {
  try {
    const user = await userService.getUserByMailId(req.params.email);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByMailId,
};