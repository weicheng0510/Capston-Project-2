import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangeRole from '../components/ChangeRole';
import UserContext from '../contect/useContect';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


// Mock the toast notifications
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('ChangeRole Component', () => {
    const mockOnClose = jest.fn();
    const mockFetchAllUsers = jest.fn();
    const mockToken = 'mock-token';
    const mockUser = {
        username: 'testuser',
        role: 'User',
        userId: '12345',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const renderWithUserContext = (ui) => {
        return render(
            <UserContext.Provider value={{ token: mockToken }}>
                {ui}
            </UserContext.Provider>
        );
    };

    it('renders correctly with given props', () => {
        renderWithUserContext(
            <ChangeRole
                username={mockUser.username}
                role={mockUser.role}
                userId={mockUser.userId}
                onClose={mockOnClose}
                fetchAllUsers={mockFetchAllUsers}
            />
        );

        expect(screen.getByText('Change User Role')).toBeInTheDocument();
        expect(screen.getByText(`Username: ${mockUser.username}`)).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('displays an error if no role is selected when submitting', () => {
        renderWithUserContext(
            <ChangeRole
                username={mockUser.username}
                role={mockUser.role}
                userId={mockUser.userId}
                onClose={mockOnClose}
                fetchAllUsers={mockFetchAllUsers}
            />
        );

        fireEvent.click(screen.getByText('Submit'));

        expect(toast.error).toHaveBeenCalledWith('Please select a valid role.');
    });

    it('calls the API to update the role and shows a success message', async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ success: true, message: 'Role updated successfully' }),
        });

        renderWithUserContext(
            <ChangeRole
                username={mockUser.username}
                role={mockUser.role}
                userId={mockUser.userId}
                onClose={mockOnClose}
                fetchAllUsers={mockFetchAllUsers}
            />
        );

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Admin' } });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.any(String), {
                method: 'post',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: mockUser.userId,
                    role: 'Admin',
                }),
            });

            expect(toast.success).toHaveBeenCalledWith('Role updated successfully');
            expect(mockOnClose).toHaveBeenCalled();
            expect(mockFetchAllUsers).toHaveBeenCalled();
        });
    });

    it('handles API errors gracefully', async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ success: false, message: 'Failed to update role' }),
        });

        renderWithUserContext(
            <ChangeRole
                username={mockUser.username}
                role={mockUser.role}
                userId={mockUser.userId}
                onClose={mockOnClose}
                fetchAllUsers={mockFetchAllUsers}
            />
        );

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Admin' } });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to update role');
        });
    });

    it('closes the modal when close button is clicked', () => {
        renderWithUserContext(
            <ChangeRole
                username={mockUser.username}
                role={mockUser.role}
                userId={mockUser.userId}
                onClose={mockOnClose}
                fetchAllUsers={mockFetchAllUsers}
            />
        );

        const closeButton = screen.getAllByRole('button')[0]; // Assuming the close button is the first button
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });
});
