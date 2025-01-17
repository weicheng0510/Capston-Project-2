const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const getProductDetail = require('../../../controller/product/getProductDetail');

// Mock the Product model
jest.mock('../../../models/Product', () => ({
    findById: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.post('/product-detail', getProductDetail);

describe('Get Product Detail Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should return product details for a given product ID', async () => {
        const mockProduct = { _id: '1', name: 'Product 1', category: 'Category A' };

        // Mock database response
        Product.findById.mockResolvedValue(mockProduct);

        const response = await request(app)
            .post('/product-detail')
            .send({ productId: '1' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Product Detail');
        expect(response.body.data).toEqual(mockProduct);
        expect(Product.findById).toHaveBeenCalledWith('1');
    });

    test('should return 400 when there is an error finding the product', async () => {
        Product.findById.mockRejectedValue(new Error('Product not found'));

        const response = await request(app)
            .post('/product-detail')
            .send({ productId: '1' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Product not found');
        expect(Product.findById).toHaveBeenCalledWith('1');
    });

    test('should return 400 if no productId is provided in request body', async () => {
        const response = await request(app)
            .post('/product-detail')
            .send({});  // Missing productId

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Product not found');
    });
});
