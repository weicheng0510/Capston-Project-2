const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const userLogout = require("../../../controller/user/userLogout");

const app = express();
app.use(bodyParser.json());
app.post("/logout", userLogout);

describe("User Logout Controller Tests", () => {
    test("should return logout success message", async () => {
        const response = await request(app)
            .post("/logout")
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Logout successful");
    });
});
