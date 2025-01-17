import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PicksForYou from '../components/PicksForYou';
import '@testing-library/jest-dom';

jest.mock('../common/api');

jest.mock('../components/ProductCard', () => ({ product }) => (
    <div>{product.name}</div>
));

describe('PicksForYou Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading state initially', async () => {
        const mockFetch = jest.fn(() =>
            new Promise((resolve) => setTimeout(() => resolve({ json: () => ({ data: [] }) }), 100))
        );
        global.fetch = mockFetch;

        render(<PicksForYou />);

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
    });


    test('renders products after fetching', async () => {
        const mockProducts = [
            { name: 'Product 1', id: 1 },
            { name: 'Product 2', id: 2 },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: mockProducts }),
            })
        );

        render(<PicksForYou />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });

        mockProducts.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });

    test('handles fetch errors gracefully', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Fetch error')));

        render(<PicksForYou />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });

        expect(screen.queryByText(/Error fetching randoms:/i)).not.toBeInTheDocument();

        const { asFragment } = render(<PicksForYou />);
        expect(asFragment()).toMatchSnapshot();
    });
});
