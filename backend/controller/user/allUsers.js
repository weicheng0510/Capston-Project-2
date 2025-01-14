const User = require('../../models/User');

async function allUsers(req, res) {
    try {
        const allUsers = await User.find();

        res.json({
            message: 'All Users',
            data: allUsers,
            success: true
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = allUsers;