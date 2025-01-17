import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
    test('renders copyright text', () => {
        render(<Footer />);

        // Check if the copyright text is in the document
        const copyrightText = screen.getByText(/Copyright © 2024 Parts Search ALL right Reserved./i);

        expect(copyrightText).toBeInTheDocument();
    });

    test('matches the snapshot', () => {
        const { asFragment } = render(<Footer />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('footer has correct background color', () => {
        const { container } = render(<Footer />);

        // Check if the footer has the correct background color
        expect(container.firstChild).toHaveClass('bg-neutral-100');
    });
});
