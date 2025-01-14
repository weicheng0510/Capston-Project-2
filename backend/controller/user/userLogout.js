async function userLogout(req, res) {
    try {
        res.status(200).json({
            message: 'Logout successful',
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'An error occurred',
            success: false,
        });
    }
}

module.exports = userLogout;