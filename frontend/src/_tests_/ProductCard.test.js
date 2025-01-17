import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '@testing-library/jest-dom';

describe('ProductCard Component', () => {
    const mockProduct = {
        _id: '12345',
        image: ['https://example.com/image.jpg'],
        title: 'Test Product',
        price: 100,
        quantity: 5,
    };

    test('renders product details correctly', () => {
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Price: $100')).toBeInTheDocument();
        expect(screen.getByText('Qty: 5')).toBeInTheDocument();
        const image = screen.getByAltText('');
        expect(image).toHaveAttribute('src', mockProduct.image[0]);
    });

    test('contains link to product details page', () => {
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} />
            </MemoryRouter>
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', `/product/${mockProduct._id}`);
    });
});
