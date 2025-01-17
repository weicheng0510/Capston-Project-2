const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const filterProduct = require('../../../controller/product/filterProduct');
const Product = require('../../../models/Product');

jest.mock('../../../models/Product', () => ({
    find: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.post('/filter', filterProduct);

describe('Filter Product Tests', () => {
    test('should return filtered products based on category', async () => {
        // Mocking the database response
        const mockProducts = [
            { id: 1, name: 'Fog Lamp', category: 'Fog & Spot Lamp' },
        ];
        Product.find.mockResolvedValue(mockProducts);

        const response = await request(app)
            .post('/filter')
            .send({ category: ['Fog & Spot Lamp'] });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockProducts);
    });

    test('should handle errors gracefully', async () => {
        Product.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/filter')
            .send({ category: ['Fog & Spot Lamp'] });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Database error');
    });
});