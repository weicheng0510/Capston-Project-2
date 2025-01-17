const User = require("../../models/User");
const bcrypt = require("bcrypt");


async function userSignUp(req, res) {
    try {
        const { email, password, username } = req.body;

        if (!email) {
            throw new Error('Please provide email');
        }
        if (!password) {
            throw new Error('Please provide password');
        }
        if (!username) {
            throw new Error('Please provide username');
        }

        // Email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error(
                "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
            );
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        if (!usernameRegex.test(username)) {
            throw new Error(
                "Username must be 3-30 characters long and contain only letters, numbers, and underscores"
            );
        }

        // Check if the email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({
                    message: `email '${email}' is already registered.`,
                    success: false,
                });
            }

            if (existingUser.username === username) {
                return res.status(400).json({
                    message: `username '${username}' is already registered.`,
                    success: false,
                });
            }
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        if (!hash) {
            throw new Error('Something is wrong')
        }

        const payload = {
            ...req.body,
            role: 'General',
            photo: req.body.image || '',
            password: hash
        }

        const userData = new User(payload);
        await userData.save();

        res.status(201).json({
            message: 'User created successfully!',
            success: true
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || 'An error occurred',
            success: false
        });
    }
}

module.exports = userSignUp;