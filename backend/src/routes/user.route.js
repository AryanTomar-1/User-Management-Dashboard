const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { createUserValidation} = require('../middlewares/userValidator');

// Create a new user
router.post('/create', createUserValidation, userController.createUser);

// Return all users
router.get('/all', userController.getAllUsers);

module.exports = router;
