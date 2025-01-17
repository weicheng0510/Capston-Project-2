import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import '@testing-library/jest-dom';

jest.mock('../assest/user-image.webp', () => 'user-image-mock');

describe('SignUp Component', () => {
    test('renders sign up form with username, email, password, and confirm password fields', () => {
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        // Check if the form fields and button are in the document
        expect(screen.getByPlaceholderText('enter username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('enter email')).toBeInTheDocument();

        // Use getAllByPlaceholderText for password fields
        const passwordInputs = screen.getAllByPlaceholderText('enter password');
        expect(passwordInputs).toHaveLength(2);
        expect(passwordInputs[0]).toBeInTheDocument();
        expect(passwordInputs[1]).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    });
});
