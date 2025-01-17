const User = require("../models/User")

const uploadPermission = async (userId) => {
    const user = await User.findById(userId)

    if (user.role === "Admin") {
        return true;
    }

    return false;
}

module.exports = uploadPermission;