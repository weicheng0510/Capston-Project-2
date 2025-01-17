import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditProduct from "../components/EditProduct";
import UserContext from "../contect/useContect";
import '@testing-library/jest-dom';

describe("EditProduct Component", () => {
    const mockProduct = {
        title: "Test Product",
        model: "Model X",
        category: "Electronics",
        brand: "Brand A",
        image: ["https://via.placeholder.com/150"],
        description: "This is a test product.",
        price: "100.00",
        quantity: "5",
    };

    const mockOnClose = jest.fn();
    const mockFetchProducts = jest.fn();
    const mockToken = "test-token";

    const renderComponent = () =>
        render(
            <UserContext.Provider value={{ token: mockToken }}>
                <EditProduct
                    onClose={mockOnClose}
                    product={mockProduct}
                    fetchProducts={mockFetchProducts}
                />
            </UserContext.Provider>
        );

    test("renders component with correct elements", () => {
        renderComponent();

        expect(screen.getByText("Edit Product")).toBeInTheDocument();
        expect(screen.getByLabelText("Product Title:")).toHaveValue(mockProduct.title);
        expect(screen.getByLabelText("Car brand:")).toBeInTheDocument();
        expect(screen.getByLabelText("Category:")).toBeInTheDocument();
        expect(screen.getByLabelText("Model:")).toHaveValue(mockProduct.model);
        expect(screen.getByLabelText("Description:")).toHaveValue(mockProduct.description);
        expect(screen.getByLabelText("Price:")).toHaveValue(100);
        expect(screen.getByLabelText("Quantity:")).toHaveValue(5);
        expect(screen.getByText("Submit")).toBeInTheDocument();
    });


    test("renders product images correctly", () => {
        renderComponent();

        const image = screen.getByAltText(mockProduct.image[0]);
        expect(image).toBeInTheDocument();
        expect(image.src).toBe(mockProduct.image[0]);
    });

    test("renders error message if no image", () => {
        const productWithoutImage = { ...mockProduct, image: [] };

        render(
            <UserContext.Provider value={{ token: mockToken }}>
                <EditProduct
                    onClose={mockOnClose}
                    product={productWithoutImage}
                    fetchProducts={mockFetchProducts}
                />
            </UserContext.Provider>
        );

        expect(screen.getByText("*Please upload product image")).toBeInTheDocument();
    });
});
