const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const getCategoryProduct = require('../../../controller/product/getCategoryProduct');

// Mock the Product model
jest.mock('../../../models/Product', () => ({
    distinct: jest.fn(),
    aggregate: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.get('/category-products', getCategoryProduct);

describe('Get Category Product Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should return a product from each category', async () => {
        // Mocked database response for distinct categories
        const mockCategories = ['Category A', 'Category B'];
        Product.distinct.mockResolvedValue(mockCategories);

        // Mocked database response for aggregate query
        const mockCategoryProducts = [
            [{ _id: '1', name: 'Product 1', category: 'Category A' }],
            [{ _id: '2', name: 'Product 2', category: 'Category B' }],
        ];

        Product.aggregate
            .mockResolvedValueOnce(mockCategoryProducts[0])
            .mockResolvedValueOnce(mockCategoryProducts[1]);

        const response = await request(app).get('/category-products');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('category product');
        expect(response.body.data).toEqual(
            mockCategoryProducts.map((products) => products[0])
        );
        expect(Product.distinct).toHaveBeenCalledWith('category');
        expect(Product.aggregate).toHaveBeenCalledTimes(mockCategories.length);
    });

    test('should handle errors gracefully', async () => {
        Product.distinct.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/category-products');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
        expect(Product.distinct).toHaveBeenCalledWith('category');
    });
});
