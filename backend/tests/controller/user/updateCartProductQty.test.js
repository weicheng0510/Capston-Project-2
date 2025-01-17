const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const updateCartProductQty = require("../../../controller/user/updateCartProductQty");
const Cart = require("../../../models/Cart");

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());

// Mock the Cart model
jest.mock("../../../models/Cart", () => {
    return {
        updateOne: jest.fn(),
    };
});

app.post("/update-cart-product-qty", updateCartProductQty);

describe("Update Cart Product Quantity Controller Tests", () => {
    let mockUpdateOne;

    beforeEach(() => {
        mockUpdateOne = Cart.updateOne;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should successfully update product quantity", async () => {
        const mockCartId = "cart123";
        const mockQuantity = 5;
        const mockUpdateResult = { nModified: 1 };  // Simulate a successful update

        // Mock the updateOne method to return a successful result
        mockUpdateOne.mockResolvedValue(mockUpdateResult);

        const response = await request(app)
            .post("/update-cart-product-qty")
            .send({ productId: mockCartId, quantity: mockQuantity });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Quantity updated successfully.");
        expect(response.body.data).toEqual(mockUpdateResult);
        expect(mockUpdateOne).toHaveBeenCalledWith(
            { _id: mockCartId },
            { $set: { quantity: mockQuantity } }
        );
    });

    test("should return error if cart product not found", async () => {
        const mockCartId = "cart123";
        const mockQuantity = 5;

        // Simulate no document modified (product not found)
        mockUpdateOne.mockResolvedValue({ nModified: 0 });

        const response = await request(app)
            .post("/update-cart-product-qty")
            .send({ productId: mockCartId, quantity: mockQuantity });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Product not found");
        expect(mockUpdateOne).toHaveBeenCalledWith(
            { _id: mockCartId },
            { $set: { quantity: mockQuantity } }
        );
    });

    test("should return error if there is a database query failure", async () => {
        const errorMessage = "Database error";
        const mockCartId = "cart123";
        const mockQuantity = 5;

        // Simulate a database error by rejecting the mock
        mockUpdateOne.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .post("/update-cart-product-qty")
            .send({ productId: mockCartId, quantity: mockQuantity });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
        expect(mockUpdateOne).toHaveBeenCalledWith(
            { _id: mockCartId },
            { $set: { quantity: mockQuantity } }
        );
    });
});
