require('dotenv').config();
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authToken = require('../middleware/authToken');  // Adjust the path if necessary

const app = express();

// Use middleware in a route
app.use('/test', authToken, (req, res) => {
    res.status(200).json({
        message: 'Authorized',
        user: req.user,
    });
});

describe('authToken Middleware Tests', () => {
    const validToken = jwt.sign({ userId: '12345' }, process.env.SECRET_KEY, { expiresIn: '1h' });

    const invalidToken = 'invalid.token';

    test('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/test');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Please login');
    });

    test('should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/test')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Please log in');
    });

    test('should return 200 if token is valid', async () => {
        const response = await request(app)
            .get('/test')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Authorized');
        expect(response.body.user).toHaveProperty('userId', '12345');
    });
});
