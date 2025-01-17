import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import UploadProduct from "../components/UploadProduct";
import UserContext from "../contect/useContect";

describe("UploadProduct Component", () => {
    test("renders the component", () => {
        // Mock UserContext
        const mockToken = "test-token";

        render(
            <UserContext.Provider value={{ token: mockToken }}>
                <UploadProduct onClose={jest.fn()} fetchAllProducts={jest.fn()} />
            </UserContext.Provider>
        );

        // Check for the presence of the main heading
        expect(screen.getByRole("heading", { name: /Upload Product/i })).toBeInTheDocument();
    });
});
