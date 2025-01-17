const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const getBrand = require('../../../controller/product/getBrand');

// Mock the Product model
jest.mock('../../../models/Product', () => ({
    distinct: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.get('/brands', getBrand);

describe('Get Brand Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should return a list of unique brands', async () => {
        // Mocked database response
        const mockBrands = ['Brand A', 'Brand B', 'Brand C'];

        Product.distinct.mockResolvedValue(mockBrands);

        const response = await request(app).get('/brands');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('brand list');
        expect(response.body.data).toEqual(mockBrands);
        expect(Product.distinct).toHaveBeenCalledWith('brand');
    });

    test('should handle errors gracefully', async () => {
        Product.distinct.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/brands');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
        expect(Product.distinct).toHaveBeenCalledWith('brand');
    });
});
