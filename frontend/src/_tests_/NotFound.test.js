import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import '@testing-library/jest-dom';

describe('NotFound Component', () => {
    test('renders Page Not Found message and Home link', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        // Check if the "Page Not Found" message is in the document
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();

        // Check if the "Go to Home" link is in the document
        expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    });
});
