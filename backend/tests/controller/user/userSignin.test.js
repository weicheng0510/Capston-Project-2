const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const userSignIn = require("../../../controller/user/userSignin");
const User = require("../../../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());
app.post("/login", userSignIn);

// Mock the User model and bcrypt
jest.mock("../../../models/User", () => {
    return {
        findOne: jest.fn(),
    };
});

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));

describe("User SignIn Controller Tests", () => {
    let mockFindOne;
    let mockCompare;
    let mockSign;

    beforeEach(() => {
        mockFindOne = User.findOne;
        mockCompare = bcrypt.compare;
        mockSign = jwt.sign;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should successfully sign in user and return token", async () => {
        const mockUser = {
            _id: "validUserId",
            username: "john_doe",
            password: "$2b$10$xyz", // bcrypt hashed password
        };
        const mockToken = "mock_jwt_token";

        // Mock user lookup and password comparison
        mockFindOne.mockResolvedValue(mockUser);
        mockCompare.mockResolvedValue(true); // Simulate correct password
        mockSign.mockReturnValue(mockToken); // Return a mock token

        const response = await request(app)
            .post("/login")
            .send({ username: "john_doe", password: "password123" });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Login successful");
        expect(response.body.token).toBe(mockToken);
        expect(mockFindOne).toHaveBeenCalledWith({ username: "john_doe" });
        expect(mockCompare).toHaveBeenCalledWith("password123", mockUser.password);
        expect(mockSign).toHaveBeenCalledWith(
            { _id: mockUser._id, username: mockUser.username },
            process.env.SECRET_KEY,
            { expiresIn: "8h" }
        );
    });

    test("should return error if username is not provided", async () => {
        const response = await request(app)
            .post("/login")
            .send({ password: "password123" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please provide a username");
    });

    test("should return error if password is not provided", async () => {
        const response = await request(app)
            .post("/login")
            .send({ username: "john_doe" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please provide a password");
    });

    test("should return error if user is not found", async () => {
        const errorMessage = "User not found";

        // Mock user lookup to return null (user not found)
        mockFindOne.mockResolvedValue(null);

        const response = await request(app)
            .post("/login")
            .send({ username: "john_doe", password: "password123" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
    });

    test("should return error if password is incorrect", async () => {
        const errorMessage = "Incorrect username or password";
        const mockUser = {
            _id: "validUserId",
            username: "john_doe",
            password: "$2b$10$xyz", // bcrypt hashed password
        };

        // Mock user lookup and password comparison (incorrect password)
        mockFindOne.mockResolvedValue(mockUser);
        mockCompare.mockResolvedValue(false); // Simulate incorrect password

        const response = await request(app)
            .post("/login")
            .send({ username: "john_doe", password: "wrongpassword" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
    });

    test("should return error if there is a database error", async () => {
        const errorMessage = "An error occurred";

        // Simulate a database error by rejecting the mock
        mockFindOne.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .post("/login")
            .send({ username: "john_doe", password: "password123" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
    });
});
