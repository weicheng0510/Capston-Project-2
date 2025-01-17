const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const removeCartProduct = require("../../../controller/user/removeCartProduct");
const Cart = require("../../../models/Cart");

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());

// Mock the Cart model
jest.mock("../../../models/Cart", () => {
    return {
        findByIdAndDelete: jest.fn(),
    };
});

app.post("/remove-cart-product", removeCartProduct);

describe("Remove Cart Product Controller Tests", () => {
    let mockFindByIdAndDelete;

    beforeEach(() => {
        mockFindByIdAndDelete = Cart.findByIdAndDelete;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should successfully remove product from cart", async () => {
        const mockCartId = "cart123";
        const mockDeletedCart = {
            _id: mockCartId,
            productId: "product123",
            userId: "validUserId",
        };

        // Mock the findByIdAndDelete method to return a mock deleted cart
        mockFindByIdAndDelete.mockResolvedValue(mockDeletedCart);

        const response = await request(app)
            .post("/remove-cart-product")
            .send({ productId: mockCartId });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Remove product successfully.");
        expect(response.body.data).toEqual(mockDeletedCart);
        expect(mockFindByIdAndDelete).toHaveBeenCalledWith(mockCartId);
    });

    test("should return error if product not found", async () => {
        const mockCartId = "cart123";

        // Simulate product not found by returning null
        mockFindByIdAndDelete.mockResolvedValue(null);

        const response = await request(app)
            .post("/remove-cart-product")
            .send({ productId: mockCartId });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Product not found");
        expect(mockFindByIdAndDelete).toHaveBeenCalledWith(mockCartId);
    });

    test("should return error if there is a database query failure", async () => {
        const errorMessage = "Database error";
        const mockCartId = "cart123";

        // Simulate a database error by rejecting the mock
        mockFindByIdAndDelete.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .post("/remove-cart-product")
            .send({ productId: mockCartId });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
        expect(mockFindByIdAndDelete).toHaveBeenCalledWith(mockCartId);
    });
});
