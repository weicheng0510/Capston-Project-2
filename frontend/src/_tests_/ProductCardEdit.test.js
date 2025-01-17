import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductCardEdit from '../components/ProductCardEdit';

describe('ProductCardEdit Component', () => {
    const mockProduct = {
        _id: '1',
        image: ['https://via.placeholder.com/150'],
        title: 'Sample Product',
        quantity: 10,
        price: 100,
    };

    test('renders product details', () => {
        render(
            <Router>
                <ProductCardEdit p={mockProduct} fetchProducts={jest.fn()} />
            </Router>
        );

        expect(screen.getByText('Sample Product')).toBeInTheDocument();
        expect(screen.getByText('Qty: 10')).toBeInTheDocument();
        expect(screen.getByText('Price: $100')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.image[0]);
        expect(screen.getByRole('img')).toHaveAttribute('alt', mockProduct.title);
    });
});
