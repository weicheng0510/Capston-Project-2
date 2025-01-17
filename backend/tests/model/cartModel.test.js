const mongoose = require('mongoose');
const Cart = require('../../models/Cart');
const db = require('../config/database');

describe('Cart Model Tests', () => {
    beforeAll(async () => {
        await db.connect();
        mongoose.set('strictQuery', true);
        await Cart.syncIndexes();
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
    });

    afterAll(async () => {
        await db.close();
    });

    afterEach(async () => {
        await db.clear();
    });

    describe('create', function () {
        test('should create a new cart', async () => {
            const newCart = new Cart({
                productId: 'someProductId',
                quantity: 2,
                userId: 'someUserId',
            });

            const savedCart = await newCart.save();

            expect(savedCart).toHaveProperty('_id');
            expect(savedCart.productId).toEqual('someProductId');
            expect(savedCart.quantity).toEqual(2);
            expect(savedCart.userId).toEqual('someUserId');
        });
        it('should not create a cart with missing required fields', async () => {
            try {
                const newCart = new Cart({
                    // missing productId and userId
                    quantity: 2,
                });
                await newCart.save();
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.errors).toHaveProperty('productId');
                expect(error.errors).toHaveProperty('userId');
            }
        });
    })
});
