const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const getCategoryProducts = require('../../../controller/product/getCategoryProducts');

// Mock the Product model
jest.mock('../../../models/Product', () => ({
    find: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.get('/category-products', getCategoryProducts);

describe('Get Category Products Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should return products for a given category with no limit', async () => {
        const mockProducts = [
            { _id: '1', name: 'Product 1', category: 'Category A' },
            { _id: '2', name: 'Product 2', category: 'Category A' },
        ];

        // Mock database response
        Product.find.mockImplementation(() => ({
            limit: jest.fn().mockResolvedValue(mockProducts),
        }));

        const response = await request(app)
            .get('/category-products')
            .query({ category: 'Category A' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Category products retrieved successfully');
        expect(response.body.data).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({ category: 'Category A' });
    });

    test('should return a limited number of products for a given category', async () => {
        const mockProducts = [
            { _id: '1', name: 'Product 1', category: 'Category B' },
        ];

        // Mock database response
        Product.find.mockImplementation(() => ({
            limit: jest.fn().mockResolvedValue(mockProducts),
        }));

        const response = await request(app)
            .get('/category-products')
            .query({ category: 'Category B', limit: 1 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Category products retrieved successfully');
        expect(response.body.data).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({ category: 'Category B' });
    });

    test('should handle errors gracefully', async () => {
        Product.find.mockImplementation(() => ({
            limit: jest.fn().mockRejectedValue(new Error('Database error')),
        }));

        const response = await request(app)
            .get('/category-products')
            .query({ category: 'Category A' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
        expect(Product.find).toHaveBeenCalledWith({ category: 'Category A' });
    });
});
