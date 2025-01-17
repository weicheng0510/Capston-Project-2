const mongoose = require('mongoose');
const User = require('../../models/User');
const db = require('../config/database');

describe('User Model Tests', () => {
    beforeAll(async () => {
        await db.connect();
        mongoose.set('strictQuery', true);
        await User.syncIndexes();
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
    });

    afterAll(async () => {
        await db.close();
    });

    afterEach(async () => {
        await db.clear();
    });

    describe('create', function () {
        test('should create a user successfully', async function () {
            const userData = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                photo: 'https://example.com/photo.jpg',
                role: 'user',
            };

            const user = await User.create(userData);

            expect(user._id).toBeDefined();
            expect(user.username).toBe(userData.username);
            expect(user.email).toBe(userData.email);
            expect(user.password).toBe(userData.password);
            expect(user.photo).toBe(userData.photo);
            expect(user.role).toBe(userData.role);
        })
        test('should fail to create a user without required fields', async function () {
            const userData = { password: 'password123' };

            let error;
            try {
                await User.create(userData);
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.name).toBe('ValidationError');
        })
        test('should enforce unique username and email', async () => {
            const userData = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            };

            await mongoose.connection.db.collection('users').insertOne(userData);

            let error;
            try {
                await mongoose.connection.db.collection('users').insertOne(userData);
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.code).toBe(11000); // Duplicate key error code
        });
        test('should default the photo field to an empty string if not provided', async () => {
            const userData = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'user',
            };

            const user = await User.create(userData);

            expect(user.photo).toBe('');
        });
        test('should include timestamps by default', async () => {
            const userData = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            };

            const user = await User.create(userData);

            expect(user.createdAt).toBeDefined();
            expect(user.updatedAt).toBeDefined();
        });
    })
});
