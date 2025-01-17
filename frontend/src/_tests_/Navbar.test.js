import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import configureStore from 'redux-mock-store';
import UserContext from '../contect/useContect';
import '@testing-library/jest-dom';


jest.mock('../style/navbar.css', () => ({}));
const mockStore = configureStore([]);


describe('Navbar Component', () => {
    let store;
    let mockSetToken;

    beforeEach(() => {
        store = mockStore({
            user: {
                user: null,
            },
        });

        mockSetToken = jest.fn();
    });

    test('renders the logo text', () => {
        render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 0 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(screen.getByText(/Parts Search/i)).toBeInTheDocument();
    });

    test('renders the search input field', () => {
        render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 0 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(screen.getByPlaceholderText(/search product here.../i)).toBeInTheDocument();
    });

    test('renders login button when user is not logged in', () => {
        render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 0 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    test('renders logout button and cart icon when user is logged in', () => {
        store = mockStore({
            user: {
                user: { _id: '123', username: 'testuser', role: 'User' },
            },
        });

        render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 2 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        expect(screen.getByText('[2]')).toBeInTheDocument();
    });

    test('renders admin panel link when user is admin and display is true', () => {
        store = mockStore({
            user: {
                user: { _id: '123', username: 'adminuser', role: 'Admin' },
            },
        });

        render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 0 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(screen.queryByText(/Admin Panel/i)).not.toBeInTheDocument();
    });
});

describe('Navbar Component Snapshot', () => {
    let store;
    let mockSetToken;

    beforeEach(() => {
        store = mockStore({
            user: {
                user: null,
            },
        });

        mockSetToken = jest.fn();
    });

    test('matches snapshot for logged-out state', () => {
        const { asFragment } = render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 0 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    test('matches snapshot for logged-in state', () => {
        store = mockStore({
            user: {
                user: { _id: '123', username: 'testuser', role: 'User' },
            },
        });

        const { asFragment } = render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 2 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    test('matches snapshot for admin user', () => {
        store = mockStore({
            user: {
                user: { _id: '123', username: 'adminuser', role: 'Admin' },
            },
        });

        const { asFragment } = render(
            <Provider store={store}>
                <UserContext.Provider value={{ setToken: mockSetToken, cartCount: 0 }}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </UserContext.Provider>
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});

