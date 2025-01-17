const mongoose = require('mongoose');
const Product = require('../../models/Product');
const db = require('../config/database');

describe('Product Model Tests', () => {
    beforeAll(async () => {
        await db.connect();
        mongoose.set('strictQuery', true);
        await Product.syncIndexes();
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
    });

    afterAll(async () => {
        await db.close();
    });

    afterEach(async () => {
        await db.clear();
    });

    describe('create', function () {
        test('should create a new product', async () => {
            const newProduct = new Product({
                title: 'Sample Product',
                brand: 'BrandName',
                model: 'Model123',
                category: 'Electronics',
                image: ['image1.jpg', 'image2.jpg'],
                description: 'This is a sample product description.',
                price: 299.99,
                quantity: 50
            });

            const savedProduct = await newProduct.save();

            expect(savedProduct).toHaveProperty('_id');
            expect(savedProduct.title).toBe('Sample Product');
            expect(savedProduct.price).toBe(299.99);
            expect(savedProduct.quantity).toBe(50);
        });
        test('should include timestamps by default', async () => {
            const newProduct = new Product({
                title: 'Sample Product',
                brand: 'BrandName',
                model: 'Model123',
                category: 'Electronics',
                image: ['image1.jpg', 'image2.jpg'],
                description: 'This is a sample product description.',
                price: 299.99,
                quantity: 50
            });

            const savedProduct = await newProduct.save();

            expect(savedProduct.createdAt).toBeDefined();
            expect(savedProduct.updatedAt).toBeDefined();
        });
    })
});
