import React from "react";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import BrandList from '../components/BrandList';
import '@testing-library/jest-dom';
import 'whatwg-fetch';


it('matches snapshot', () => {
    const { asFragment } = render(<BrandList />)
    expect(asFragment()).toMatchSnapshot();
});

// Test for loading state
it('shows the loading text', () => {
    render(<BrandList />);
    // Ensure the "Loading..." text is in the document during the loading phase
    expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('renders correct brand links', async () => {
    // Mock successful API response
    const mockData = { data: ['Brand 1', 'Brand 2'] };
    global.fetch = jest.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
    });

    render(
        <MemoryRouter>
            <BrandList />
        </MemoryRouter>
    );

    // Wait for the mock data to be rendered
    expect(await screen.findByText('Brand 1')).toBeInTheDocument();
    expect(screen.getByText('Brand 2')).toBeInTheDocument();

    // Clean up the mock after the test
    global.fetch.mockRestore();
});


