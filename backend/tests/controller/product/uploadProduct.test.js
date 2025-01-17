const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const Product = require("../../../models/Product");
const uploadPermission = require("../../../helpers/permission");
const uploadProductControll = require("../../../controller/product/uploadProduct");
const authToken = require("../../../middleware/authToken");

// Setting up the Express app for testing
const app = express();
app.use(bodyParser.json());

// Mock the authToken middleware to simulate authentication
jest.mock("../../../middleware/authToken", () => {
    return jest.fn((req, res, next) => {
        req.user = { _id: "validUserId" };
        next();
    });
});

// Apply the authToken middleware before the route handler
app.use(authToken);
app.post("/upload-product", uploadProductControll);

// Mocking the Product model and the uploadPermission helper
jest.mock("../../../models/Product", () => {
    return jest.fn();
});

jest.mock("../../../helpers/permission", () => jest.fn());

describe("Upload Product Controller Tests", () => {
    let reqBody;
    let mockProductSave;

    beforeEach(() => {
        reqBody = {
            _id: "12345",
            title: "Sample Product",
            description: "This is a sample product.",
            price: 100,
            quantity: 10,
            category: "Electronics",
            brand: "BrandName",
            model: "ModelName",
            image: ["http://example.com/image.jpg"],
        };

        // Set up a mock implementation for uploadPermission
        uploadPermission.mockImplementation((userId) => userId === "validUserId");

        // Mock the `save` method on Product's prototype
        mockProductSave = jest.fn();
        Product.mockImplementation(() => ({
            save: mockProductSave,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should upload product successfully with valid permissions", async () => {
        const mockSavedProduct = {
            ...reqBody,
            _id: "67890",
        };

        mockProductSave.mockResolvedValue(mockSavedProduct);

        const response = await request(app)
            .post("/upload-product")
            .set("Authorization", "Bearer valid-token")
            .send(reqBody);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Product upload successfully");
        expect(response.body.data).toEqual(mockSavedProduct);
        expect(mockProductSave).toHaveBeenCalledTimes(1);
        expect(uploadPermission).toHaveBeenCalledWith("validUserId");
    });

    test("should deny access if user lacks permissions", async () => {
        uploadPermission.mockImplementation(() => false);

        const response = await request(app)
            .post("/upload-product")
            .set("Authorization", "Bearer valid-token")
            .send(reqBody);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Permission denied");
        expect(mockProductSave).not.toHaveBeenCalled();
        expect(uploadPermission).toHaveBeenCalledWith("validUserId");
    });

    test("should return error if saving product fails", async () => {
        mockProductSave.mockRejectedValue(new Error("Database error"));

        const response = await request(app)
            .post("/upload-product")
            .set("Authorization", "Bearer valid-token")
            .send(reqBody);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Database error");
        expect(mockProductSave).toHaveBeenCalledTimes(1);
        expect(uploadPermission).toHaveBeenCalledWith("validUserId");
    });

    test("should return error if user is not authenticated", async () => {
        // Mock the authToken middleware to simulate missing token
        authToken.mockImplementation((req, res, next) => {
            return res.status(401).json({ success: false, message: "Please log in" });
        });

        // Send request without Authorization header
        const response = await request(app)
            .post("/upload-product")
            .send(reqBody);

        // Expecting a 401 error because the token is missing
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please log in");
        expect(mockProductSave).not.toHaveBeenCalled();
        expect(uploadPermission).not.toHaveBeenCalled();
    });

});
