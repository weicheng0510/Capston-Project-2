const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const countCart = require("../../../controller/user/countCart");
const authToken = require("../../../middleware/authToken");
const Cart = require("../../../models/Cart");

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());

// Mock the authToken middleware to simulate authentication failure (no token)
jest.mock("../../../middleware/authToken", () => {
    return jest.fn((req, res, next) => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({
                message: "Please log in",
                success: false,
            });
        }
        req.user = { _id: "validUserId" }; // Mock authenticated user ID
        next();
    });
});

// Apply the authToken middleware before the route handler
app.use(authToken);
app.get("/count-cart", countCart);

// Mock the Cart model
jest.mock("../../../models/Cart", () => {
    return {
        countDocuments: jest.fn(),
    };
});

describe("Count Cart Controller Tests", () => {
    let mockCountDocuments;

    beforeEach(() => {
        mockCountDocuments = Cart.countDocuments;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return cart count successfully", async () => {
        const mockCount = 5;

        // Mock the countDocuments method to return a specific count
        mockCountDocuments.mockResolvedValue(mockCount);

        const response = await request(app)
            .get("/count-cart")
            .set("Authorization", "Bearer valid-token") // Mock token
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Cart count");
        expect(response.body.data.count).toBe(mockCount);
        expect(mockCountDocuments).toHaveBeenCalledWith({
            userId: "validUserId",
        });
    });

    test("should return error if there is a database query failure", async () => {
        const errorMessage = "Database query failed";

        // Simulate a database error by rejecting the mock
        mockCountDocuments.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .get("/count-cart")
            .set("Authorization", "Bearer valid-token") // Mock token
            .send();

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
        expect(mockCountDocuments).toHaveBeenCalledWith({
            userId: "validUserId",
        });
    });

    test("should return error if user is not authenticated", async () => {
        // Send request without Authorization header
        const response = await request(app)
            .get("/count-cart")
            .send();

        // Expecting a 401 error because the token is missing
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please log in");
    });
});
