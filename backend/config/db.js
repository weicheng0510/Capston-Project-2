const mongoose = require('mongoose');

// Asynchronous function to connect to the database
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.log(err);
    };
};

module.exports = connectDB;