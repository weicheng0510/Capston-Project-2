const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const getRandomProduct = require('../../../controller/product/getRandomProduct');

// Mock the Product model
jest.mock('../../../models/Product', () => ({
    aggregate: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.get('/random-products', getRandomProduct);

describe('Get Random Product Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should return 4 random products', async () => {
        const mockProducts = [
            { _id: '1', name: 'Product 1' },
            { _id: '2', name: 'Product 2' },
            { _id: '3', name: 'Product 3' },
            { _id: '4', name: 'Product 4' },
        ];

        // Mock the aggregate method to return random products
        Product.aggregate.mockResolvedValue(mockProducts);

        const response = await request(app).get('/random-products');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Random Products');
        expect(response.body.data).toEqual(mockProducts);
        expect(Product.aggregate).toHaveBeenCalledWith([{ $sample: { size: 4 } }]);
    });

    test('should return 400 when there is an error in fetching random products', async () => {
        // Mock an error scenario
        Product.aggregate.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/random-products');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
    });
});
