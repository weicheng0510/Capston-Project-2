import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FullImage from '../components/FullImage';
import '@testing-library/jest-dom';

describe('FullImage', () => {
    const mockOnClose = jest.fn();

    test('renders image with correct URL', () => {
        const imgUrl = 'https://example.com/image.jpg';

        render(<FullImage imgUrl={imgUrl} onClose={mockOnClose} />);

        // Check if the image is rendered
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', imgUrl);
    });

    test('calls onClose when close button is clicked', () => {
        const imgUrl = 'https://example.com/image.jpg';

        render(<FullImage imgUrl={imgUrl} onClose={mockOnClose} />);

        // Find the close button and click it
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        // Verify that the onClose callback has been called
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('renders the close button correctly', () => {
        const imgUrl = 'https://example.com/image.jpg';

        render(<FullImage imgUrl={imgUrl} onClose={mockOnClose} />);

        // Check if the close button is rendered with the correct icon
        const closeButton = screen.getByRole('button');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toContainHTML('<svg');
    });
    test('matches snapshot', () => {
        const imgUrl = 'https://example.com/image.jpg';

        const { asFragment } = render(<FullImage imgUrl={imgUrl} onClose={mockOnClose} />);

        // Take a snapshot of the rendered component
        expect(asFragment()).toMatchSnapshot();
    });
});
