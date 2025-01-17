import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';
import { MemoryRouter } from 'react-router-dom';
import UserContext from '../contect/useContect';
import '@testing-library/jest-dom';

// Mock the context value to avoid errors
const MockUserContext = ({ children }) => {
    const mockSetToken = jest.fn();
    return (
        <UserContext.Provider value={{ token: null, setToken: mockSetToken }}>
            {children}
        </UserContext.Provider>
    );
};

describe('Login Component', () => {
    test('renders login form with username, password input, and login button', () => {
        render(
            <MemoryRouter>
                <MockUserContext>
                    <Login />
                </MockUserContext>
            </MemoryRouter>
        );

        // Check if the input fields and button are in the document
        expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
});