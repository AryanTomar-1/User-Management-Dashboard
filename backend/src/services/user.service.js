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

async function deleteUser(email) {
    const res = await User.findOneAndDelete({ email: email });
    return !!res;
}

module.exports = {
    createUser,
    getAllUsers,
    getUserByMailId,
    updateUser,
    deleteUser,
};