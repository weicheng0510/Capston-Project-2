const User = require('../../models/User');

async function userDetail(req, res) {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            data: user,
            success: true,
            message: "User details"
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
};

module.exports = userDetail;