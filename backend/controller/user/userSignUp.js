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

        const salt = bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);

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
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            res.status(400).json({
                message: `${field} '${value}' is already registered.`,
                success: false
            })
        } else {
            res.status(400).json({
                message: err.message || 'An error occurred',
                success: false
            });
        }
    }
}

module.exports = userSignUp;