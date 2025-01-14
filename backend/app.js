const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index');

const app = express();

// Configure CORS to allow requests from the frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Parse incoming JSON and URL-encoded data with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api", router)

module.exports = app;