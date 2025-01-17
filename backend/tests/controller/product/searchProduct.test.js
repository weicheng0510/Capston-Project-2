const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../../../models/Product');
const searchProduct = require('../../../controller/product/searchProduct');

// Mock the Product model
jest.mock('../../../models/Product', () => ({
    find: jest.fn(),
}));

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());
app.get('/search', searchProduct);

describe('Search Product Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return search results based on query', async () => {
        const query = 'lamp';
        const mockProducts = [
            { _id: '1', title: 'Fog Lamp', brand: 'Brand A', category: 'Lighting', model: '123' },
            { _id: '2', title: 'Desk Lamp', brand: 'Brand B', category: 'Lighting', model: '456' },
        ];

        Product.find.mockResolvedValue(mockProducts);

        const response = await request(app).get('/search').query({ q: query });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Search product list');
        expect(response.body.data).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({
            '$or': [
                { title: expect.any(RegExp) },
                { brand: expect.any(RegExp) },
                { category: expect.any(RegExp) },
                { model: expect.any(RegExp) }
            ]
        });
        expect(Product.find).toHaveBeenCalledWith({
            '$or': expect.arrayContaining([
                expect.objectContaining({ title: expect.any(RegExp) })
            ])
        });
    });

    test('should handle errors gracefully', async () => {
        const query = 'lamp';

        // Mock an error scenario
        Product.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/search').query({ q: query });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
    });
});
