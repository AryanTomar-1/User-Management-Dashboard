const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controlle');
const { createUserValidation} = require('../middlewares/userValidator');

// Create a new user
router.post('/create', createUserValidation, userController.createUser);

// Return all users
router.get('/all', userController.getAllUsers);

// Return a single user by email
router.get('/find/:email', userController.getUserByMailId);

module.exports = router;
