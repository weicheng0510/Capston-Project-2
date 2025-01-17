const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const getAllProducts = require('../../../controller/product/getAllProducts');

// Mock the Product model
jest.mock('../../../models/Product', () => ({
    find: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.get('/products', getAllProducts);

describe('Get All Products Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should return all products sorted by createdAt in descending order', async () => {
        // Mocked database response
        const mockProducts = [
            { id: 1, name: 'Product A', createdAt: '2025-01-01T10:00:00Z' },
            { id: 2, name: 'Product B', createdAt: '2025-01-02T12:00:00Z' },
        ];
        Product.find.mockImplementation(() => ({
            sort: jest.fn().mockResolvedValue(mockProducts),
        }));

        const response = await request(app).get('/products');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('All Product');
        expect(response.body.data).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith();
    });

    test('should handle errors gracefully', async () => {
        // Mock a rejected promise from the database

        Product.find.mockImplementation(() => ({
            sort: jest.fn().mockRejectedValue(new Error('Database error')),
        }));

        const response = await request(app).get('/products');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
        expect(Product.find).toHaveBeenCalledWith();
    });
});
