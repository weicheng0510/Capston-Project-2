import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import reactRouter from "react-router";
import AdminPanel from "../pages/AdminPanel";
import Role from "../common/role";
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

describe("AdminPanel Component", () => {
    test("renders the component for an admin user", () => {
        const store = mockStore({
            user: {
                user: {
                    username: "AdminUser",
                    role: Role.Admin,
                    photo: "https://via.placeholder.com/150",
                },
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdminPanel />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText("AdminUser")).toBeInTheDocument();
        expect(screen.getByText((content) => content.trim().toLowerCase() === "admin")).toBeInTheDocument();
        expect(screen.getByText("All Users")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
    });

    test("redirects non-admin user", () => {
        const store = mockStore({
            user: {
                user: {
                    username: "RegularUser",
                    role: "User",
                },
            },
        });

        const mockNavigate = jest.fn();
        jest.spyOn(reactRouter, "useNavigate").mockImplementation(() => mockNavigate);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdminPanel />
                </MemoryRouter>
            </Provider>
        );

        // Ensure the user is redirected
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
