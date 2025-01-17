import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimilarProduct from '../components/SimilarProduct';

jest.mock('../components/ProductCard', () => ({ product }) => (
    <div data-testid="product-card">
        <p>{product.title}</p>
    </div>
));

describe('SimilarProduct Component', () => {
    const mockCategory = 'electronics';
    const mockProducts = [
        { title: 'Product 1' },
        { title: 'Product 2' },
        { title: 'Product 3' },
        { title: 'Product 4' },
    ];

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: mockProducts }),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', async () => {
        render(<SimilarProduct category={mockCategory} limit={4} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders similar products after fetching', async () => {
        render(<SimilarProduct category={mockCategory} limit={4} />);

        // Wait for fetch to resolve
        expect(await screen.findByText('Similar products:')).toBeInTheDocument();

        mockProducts.forEach((product) => {
            expect(screen.getByText(product.title)).toBeInTheDocument();
        });

        expect(screen.getAllByTestId('product-card')).toHaveLength(mockProducts.length);
    });
});
