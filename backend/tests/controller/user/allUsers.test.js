const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const allUsers = require("../../../controller/user/allUsers");
const User = require("../../../models/User");

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());

// Mocking the User model
jest.mock("../../../models/User", () => {
    return {
        find: jest.fn(),
    };
});

app.get("/all-users", allUsers);

describe("All Users Controller Tests", () => {
    let mockUsers;

    beforeEach(() => {
        mockUsers = [
            { _id: "1", name: "User One", email: "user1@example.com" },
            { _id: "2", name: "User Two", email: "user2@example.com" },
        ];

        // Set up mock for User.find()
        User.find.mockResolvedValue(mockUsers);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return all users successfully", async () => {
        const response = await request(app)
            .get("/all-users")
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("All Users");
        expect(response.body.data).toEqual(mockUsers);
        expect(User.find).toHaveBeenCalledTimes(1); // Ensure the `find` method was called once
    });

    test("should return an error if database query fails", async () => {
        const errorMessage = "Database error";
        // Simulate error in the `find` query
        User.find.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .get("/all-users")
            .send();

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(errorMessage);
        expect(User.find).toHaveBeenCalledTimes(1); // Ensure the `find` method was called once
    });
});
