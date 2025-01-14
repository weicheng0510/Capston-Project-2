const uploadPermission = require('../../helpers/permission');
const User = require('../../models/User');

async function userUpdate(req, res) {
    try {
        const sessionUser = req.user;

        const { userId, role, username, email } = req.body;

        const payload = {
            ...(email && { email: email }),
            ...(username && { username: username }),
            ...(role && { role: role }),
        }

        if (!uploadPermission(sessionUser._id)) {
            throw new Error('Permission denied');
        }

        const updateUser = await User.findByIdAndUpdate(userId, payload, { new: true });

        res.json({
            data: updateUser,
            message: "User updated",
            success: true
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = userUpdate;