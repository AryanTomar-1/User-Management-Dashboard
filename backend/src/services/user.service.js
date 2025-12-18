const User = require('../models/user.model');

async function createUser(data) {
    const user = new User(data);
    return await user.save();
}

async function getAllUsers() {
    return await User.find().lean();
}

async function getUserByMailId(email) {
    return await User.find({
        email: { $regex: `^${email}`, $options: "i" }
    });
}

async function updateUser(email, updates) {
    const updated = await User.findOneAndUpdate(
        { email: email },
        updates,
        {
            new: true,
            runValidators: true,
            context: 'query',
        }
    ).lean();
    return updated;
}

module.exports = {
    createUser,
    getAllUsers,
    getUserByMailId,
    updateUser,
};