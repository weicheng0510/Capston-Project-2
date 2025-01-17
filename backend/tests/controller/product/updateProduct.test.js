const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const updateProduct = require('../../../controller/product/updateProduct');
const uploadPermission = require('../../../helpers/permission');
const User = require('../../../models/User');

// Mocking the Product model, permission helper, and User model
jest.mock('../../../models/Product', () => ({
    findByIdAndUpdate: jest.fn(),
}));

jest.mock('../../../helpers/permission', () => jest.fn());

jest.mock('../../../models/User', () => ({
    findById: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    // Middleware to mock authenticated user
    req.user = { _id: 'user123' };
    next();
});
app.put('/update-product', updateProduct);

describe('Update Product Tests', () => {
    beforeEach(() => {
        User.findById.mockResolvedValue({ _id: 'user123', role: 'ADMIN' });
        uploadPermission.mockResolvedValue(true);
        Product.findByIdAndUpdate.mockResolvedValue({
            _id: '123',
            name: 'Updated Product',
            category: 'Updated Category',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should update product successfully', async () => {
        const updatedProduct = { name: 'Updated Product', category: 'Updated Category' };

        const response = await request(app)
            .put('/update-product')
            .send({ _id: '123', ...updatedProduct }); // Include _id in the request body

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Product updated successfully');
        expect(response.body.data).toEqual({
            _id: '123',
            name: 'Updated Product',
            category: 'Updated Category',
        });
        expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('123', updatedProduct, { new: true });
    });

    test('should deny access if permission is not granted', async () => {
        uploadPermission.mockResolvedValue(false);

        const response = await request(app)
            .put('/update-product')
            .send({ _id: '123', name: 'Updated Product' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Permission denied');
        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
        Product.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put('/update-product')
            .send({ _id: '123', name: 'Updated Product' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
    });
});
