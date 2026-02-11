import { TextEncoder, TextDecoder } from 'util';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { test, expect, vi } from 'vitest';
import Login from '../pages/Login';
import '@testing-library/jest-dom/vitest';

// 1. Fix the environment globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 2. Mock useAuth directly (Bypasses the need for AuthProvider)
vi.mock("../context/useAuth", () => ({
  useAuth: () => ({
    user: null, 
    login: vi.fn(),
    logout: vi.fn(),
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

// 3. Mock the API
vi.mock("../services/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

test('renders login page correctly', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // getAllByText returns an array, so we check if the array has items
  const logoElements = screen.getAllByText(/BrainDump/i);
  expect(logoElements.length).toBeGreaterThan(0);

  // This one is unique, so getByText is fine here
  expect(screen.getByText(/Smart Notes/i)).toBeInTheDocument();
});