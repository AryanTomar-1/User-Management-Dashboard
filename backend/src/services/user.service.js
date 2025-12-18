const User = require('../models/user.model');

async function createUser(data) {
    const user = new User(data);
    return await user.save();
}

module.exports = {
	createUser,
};