import addToCart from "../helpers/addToCart";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

describe("addToCart function", () => {
    const mockEvent = { preventDefault: jest.fn() };
    const mockToken = "test-token";
    const mockProductId = "12345";

    beforeEach(() => {
        global.fetch = jest.fn();
        jest.clearAllMocks();
    });

    afterEach(() => {
        delete global.fetch;
    });

    test("shows an error toast if token is missing", async () => {
        await addToCart(mockEvent, mockProductId, null);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Please log in");
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test("makes a successful API call and shows a success toast", async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true, message: "Added to cart successfully" }),
        };

        global.fetch.mockResolvedValue(mockResponse);

        await addToCart(mockEvent, mockProductId, mockToken);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
            method: expect.any(String),
            credentials: "include",
            headers: {
                Authorization: `Bearer ${mockToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: mockProductId }),
        });
        expect(toast.success).toHaveBeenCalledWith("Added to cart successfully");
    });

    test("shows an error toast if the API call fails", async () => {
        const mockResponse = {
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
        };

        global.fetch.mockResolvedValue(mockResponse);

        await addToCart(mockEvent, mockProductId, mockToken);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });

    test("handles exceptions and shows an error toast", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        await addToCart(mockEvent, mockProductId, mockToken);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });
});
