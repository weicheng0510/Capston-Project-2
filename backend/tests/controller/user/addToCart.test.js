const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const Cart = require("../../../models/Cart");
const addToCart = require("../../../controller/user/addToCart");
const authToken = require("../../../middleware/authToken");

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());

// Modify the mock to simulate an unauthorized user when no token is passed
jest.mock("../../../middleware/authToken", () => {
    return jest.fn((req, res, next) => {
        if (!req.headers['authorization']) {
            return res.status(401).json({
                message: "Please log in",
                success: false,
            });
        }
        req.user = { _id: "validUserId" }; // Mock valid user if token is present
        next();
    });
});


// Apply the authToken middleware before the route handler
app.use(authToken);
app.post("/add-to-cart", addToCart);

// Mocking the Cart model
jest.mock("../../../models/Cart", () => {
    return jest.fn();
});

describe("Add to Cart Controller Tests", () => {
    let reqBody;
    let mockCartSave;
    let mockCartFindOne;

    beforeEach(() => {
        reqBody = { productId: "product123" };

        // Mock the `findOne` method on Cart to simulate product check
        mockCartFindOne = jest.fn();
        Cart.findOne = mockCartFindOne;

        // Mock the `save` method on Cart to simulate saving the cart
        mockCartSave = jest.fn();
        Cart.mockImplementation(() => ({
            save: mockCartSave,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should add product to cart if not already in cart", async () => {
        // Simulate no product in cart
        mockCartFindOne.mockResolvedValue(null);

        const mockSavedCart = {
            productId: reqBody.productId,
            quantity: 1,
            userId: "validUserId",
            _id: "cart123",
        };

        mockCartSave.mockResolvedValue(mockSavedCart);

        const response = await request(app)
            .post("/add-to-cart")
            .set("Authorization", "Bearer valid-token") // Mock token
            .send(reqBody);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Product added");
        expect(response.body.data).toEqual(mockSavedCart);
        expect(mockCartSave).toHaveBeenCalledTimes(1);
        expect(mockCartFindOne).toHaveBeenCalledWith({
            productId: reqBody.productId,
            userId: "validUserId",
        });
    });

    test("should return error if product is already in cart", async () => {
        // Simulate the product already in the cart
        mockCartFindOne.mockResolvedValue({ productId: reqBody.productId });

        const response = await request(app)
            .post("/add-to-cart")
            .set("Authorization", "Bearer valid-token") // Mock token
            .send(reqBody);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Already add to cart");
        expect(mockCartSave).not.toHaveBeenCalled();
        expect(mockCartFindOne).toHaveBeenCalledWith({
            productId: reqBody.productId,
            userId: "validUserId",
        });
    });

    test("should return error if there is a database error", async () => {
        // Simulate a database error
        mockCartFindOne.mockResolvedValue(null);
        mockCartSave.mockRejectedValue(new Error("Database error"));

        const response = await request(app)
            .post("/add-to-cart")
            .set("Authorization", "Bearer valid-token") // Mock token
            .send(reqBody);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Database error");
        expect(mockCartSave).toHaveBeenCalledTimes(1);
    });

    test("should return error if user is not authenticated", async () => {
        // Send request without Authorization header
        const response = await request(app)
            .post("/add-to-cart")
            .send(reqBody);

        // Expecting a 401 error because the token is missing
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please log in");
    });
});
