const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controlle');
const { createUserValidation,updateUserValidation} = require('../middlewares/userValidator');

// Create a new user
router.post('/create', createUserValidation, userController.createUser);

// Return all users
router.get('/all', userController.getAllUsers);

// Return user by email
router.get('/find/:email', userController.getUserByMailId);

// Update a user's details
router.put('/update/:email', updateUserValidation, userController.updateUser);

module.exports = router;
