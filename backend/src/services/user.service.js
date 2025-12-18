const User = require('../models/user.model');

async function createUser(data) {
    const user = new User(data);
    return await user.save();
}

async function getAllUsers() {
    return await User.find().lean();
}

module.exports = {
	createUser,
	getAllUsers,
};