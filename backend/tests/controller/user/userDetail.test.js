const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const userDetail = require("../../../controller/user/userDetail");
const User = require("../../../models/User");
const authToken = require("../../../middleware/authToken");

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());

// Mock the authToken middleware
jest.mock("../../../middleware/authToken", () => {
    return jest.fn((req, res, next) => {
        req.user = { _id: "validUserId" }; // Mock user ID
        next();
    });
});

// Apply the authToken middleware before the route handler
app.use(authToken);
app.get("/user-detail", userDetail);

// Mock the User model
jest.mock("../../../models/User", () => {
    return {
        findById: jest.fn(),
    };
});

describe("User Detail Controller Tests", () => {
    let mockFindById;

    beforeEach(() => {
        mockFindById = User.findById;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return user details successfully", async () => {
        const mockUser = {
            _id: "validUserId",
            name: "John Doe",
            email: "john@example.com",
        };

        // Mock the findById method to return a mock user
        mockFindById.mockResolvedValue(mockUser);

        const response = await request(app)
            .get("/user-detail")
            .set("Authorization", "Bearer valid-token") // Mock token
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("User details");
        expect(response.body.data).toEqual(mockUser);
        expect(mockFindById).toHaveBeenCalledWith("validUserId");
    });

    test("should return error if user is not found", async () => {
        const errorMessage = "User not found";

        // Simulate user not found by returning null
        mockFindById.mockResolvedValue(null);

        const response = await request(app)
            .get("/user-detail")
            .set("Authorization", "Bearer valid-token")
            .send();

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
        expect(mockFindById).toHaveBeenCalledWith("validUserId");
    });

    test("should return error if there is a database query failure", async () => {
        const errorMessage = "Database error";

        // Simulate a database error by rejecting the mock
        mockFindById.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .get("/user-detail")
            .set("Authorization", "Bearer valid-token")
            .send();

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
        expect(mockFindById).toHaveBeenCalledWith("validUserId");
    });
});
