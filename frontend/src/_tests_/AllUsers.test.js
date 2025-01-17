import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import AllUsers from "../pages/AllUsers";
import UserContext from "../contect/useContect";

jest.mock("../common/api", () => ({
    allUser: { url: "/api/users", method: "GET" },
}));

describe("AllUsers Component", () => {
    beforeEach(() => {
        // Mock fetch response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        success: true,
                        data: [
                            {
                                _id: "1",
                                username: "JohnDoe",
                                email: "john@example.com",
                                role: "User",
                                createdAt: "2023-01-01T10:00:00Z",
                            },
                        ],
                    }),
            })
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders the component and displays loading indicator", async () => {
        const mockToken = "test-token";

        render(
            <UserContext.Provider value={{ token: mockToken }}>
                <AllUsers />
            </UserContext.Provider>
        );

        expect(screen.getByText(/loading.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByRole("columnheader", { name: /username/i })).toBeInTheDocument();
            expect(screen.getByRole("columnheader", { name: /e-mail/i })).toBeInTheDocument();
            expect(screen.getByRole("columnheader", { name: /role/i })).toBeInTheDocument();
            expect(screen.getByRole("columnheader", { name: /created date/i })).toBeInTheDocument();
        });

        // Verify the user row is rendered
        expect(screen.getByText(/johndoe/i)).toBeInTheDocument();
        expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
        expect(screen.getAllByText(/user/i)[1]).toBeInTheDocument();
        expect(screen.getByText(/01\/01\/2023/i)).toBeInTheDocument();
    });
});
