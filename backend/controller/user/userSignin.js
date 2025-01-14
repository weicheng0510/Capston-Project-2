const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

async function userSignIn(req, res) {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username) {
            throw new Error('Please provide a username');
        }
        if (!password) {
            throw new Error('Please provide a password');
        }

        // Find the user by username
        const userData = await User.findOne({ username });
        if (!userData) {
            throw new Error('User not found');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect username or password');
        }

        // Generate JWT token
        const data = {
            _id: userData._id,
            username: userData.username,
        };
        const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '8h' });

        // Respond with the token
        res.status(200).json({
            message: 'Login successful',
            token, // Send token to the frontend for storage in localStorage
            success: true,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || 'An error occurred',
            success: false,
        });
    }
}

module.exports = userSignIn;
