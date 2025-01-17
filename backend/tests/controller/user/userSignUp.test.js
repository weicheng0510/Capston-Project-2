const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const userSignUp = require("../../../controller/user/userSignUp");

// Mock the User model correctly
jest.mock("../../../models/User", () => {
    const save = jest.fn().mockResolvedValue(true);
    const findOne = jest.fn();

    const User = jest.fn().mockImplementation((userData) => {
        return {
            ...userData,
            save,
        };
    });

    return {
        findOne,
        User,
    };
});

const app = express();
app.use(bodyParser.json());
app.post("/signup", userSignUp);

describe("User SignUp Controller Tests", () => {
    test("should return error if email is already registered", async () => {
        const mockUserData = { email: "john@example.com", username: "new_user", password: "Password123!" };

        // Simulate email conflict
        require("../../../models/User").findOne.mockResolvedValue({ email: "john@example.com" });

        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("email 'john@example.com' is already registered.");
    });

    test("should return error if username is already registered", async () => {
        const mockUserData = { email: "newuser@example.com", username: "john_doe", password: "Password123!" };

        // Simulate username conflict
        require("../../../models/User").findOne.mockResolvedValue({ username: "john_doe" });

        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("username 'john_doe' is already registered.");
    });

    test("should return error if missing email", async () => {
        const mockUserData = { username: "new_user", password: "Password123!" };

        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please provide email");
    });

    test("should return error if missing password", async () => {
        const mockUserData = { email: "newuser@example.com", username: "new_user" };

        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please provide password");
    });

    test("should return error if invalid email format", async () => {
        const mockUserData = { email: "invalidemail", username: "new_user", password: "Password123!" };

        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid email format");
    });

    test("should return error if password does not meet criteria", async () => {
        const mockUserData = { email: "newuser@example.com", username: "new_user", password: "short" };

        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character");
    });

    test("should return error if invalid username format", async () => {
        const mockUserData = { email: "newuser@example.com", username: "invalid username", password: "Password123!" };

        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Username must be 3-30 characters long and contain only letters, numbers, and underscores");
    });

    test("should return error if there is an unexpected error", async () => {
        const errorMessage = "An error occurred";

        // Simulate an unexpected error
        require("../../../models/User").findOne.mockRejectedValue(new Error(errorMessage));

        const mockUserData = { email: "john@example.com", username: "john_doe", password: "Password123!" };
        const response = await request(app).post("/signup").send(mockUserData);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
    });
});
