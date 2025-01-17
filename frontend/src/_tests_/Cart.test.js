import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Cart from '../pages/Cart';
import UserContext from '../contect/useContect';
import { ToastContainer } from 'react-toastify';
import '@testing-library/jest-dom';


// Mocking the fetch function globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ success: true, data: [] }),
    })
);

const mockContext = {
    token: 'testToken',
    cartCount: 3,
    fetchCart: jest.fn(),
};

describe('Cart Component', () => {
    test('renders Cart component and displays cart title and empty cart message when no data', async () => {
        render(
            <UserContext.Provider value={mockContext}>
                <ToastContainer />
                <Cart />
            </UserContext.Provider>
        );

        await waitFor(() => screen.getByText('Cart is Empty!'));

        expect(screen.getByText('Cart is Empty!')).toBeInTheDocument();

    });
});