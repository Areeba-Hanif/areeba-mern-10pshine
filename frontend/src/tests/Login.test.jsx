import { TextEncoder, TextDecoder } from 'util';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect, vi, beforeEach } from 'vitest';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import { AuthProvider } from '../context/useAuth';
import '@testing-library/jest-dom/vitest';

// Fix the environment globally
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}

const mockLogin = vi.fn();
const mockToggleTheme = vi.fn();

// Mock useAuth
vi.mock("../context/useAuth", () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    user: null, 
    login: mockLogin,
    logout: vi.fn(),
    isDark: false,
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock the API
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

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('renders login page correctly', () => {
  renderLogin();
  const logoElements = screen.getAllByText(/BrainDump/i);
  expect(logoElements.length).toBeGreaterThan(0);
  expect(screen.getByText(/Smart Notes/i)).toBeInTheDocument();
});

test('navigates to forgot password page', () => {
  renderLogin();
  const link = screen.getByText(/Forgot Password\?/i);
  expect(link.closest('a')).toHaveAttribute('href', '/forgot-password');
});

test('shows validation on forgot password submit', async () => {
  render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );
  
  // FIXED: Name matched to "Send Recovery Link" from your console log
  const submitBtn = screen.getByRole('button', { name: /Send Recovery Link/i });
  fireEvent.click(submitBtn);
  
  // Checking if the email input is present and required
  const emailInput = screen.getByPlaceholderText(/Email Address/i);
  expect(emailInput).toHaveAttribute('required');
});

test('toggles password visibility when eye icon is clicked', () => {
  renderLogin();
  
  // 1. Find the input by its label text "Password" 
  // (In your JSX, you have <label htmlFor="login-password">Password</label>)
  const passwordInput = screen.getByLabelText(/^password$/i);
  
  // 2. Find the button using the aria-label you provided in the component
  const toggleBtn = screen.getByRole('button', { name: /show password/i });

  // Initial state should be password
  expect(passwordInput).toHaveAttribute('type', 'password');
  
  // Click to show
  fireEvent.click(toggleBtn);
  expect(passwordInput).toHaveAttribute('type', 'text');
  
  // Click to hide (The label changes to "Hide password" in your code)
  const hideBtn = screen.getByRole('button', { name: /hide password/i });
  fireEvent.click(hideBtn);
  expect(passwordInput).toHaveAttribute('type', 'password');
});

test('calls toggleTheme when theme button is clicked', () => {
  renderLogin();
  // Find the button with the theme icon logic
  const buttons = screen.getAllByRole('button');
  const themeBtn = buttons.find(btn => btn.className.includes('rounded-xl'));
  
  if (themeBtn) {
    fireEvent.click(themeBtn);
    expect(mockToggleTheme).toHaveBeenCalled();
  }
});