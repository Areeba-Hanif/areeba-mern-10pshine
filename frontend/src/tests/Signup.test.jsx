import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import React from 'react';

// 1. Mock the context BEFORE importing the component
vi.mock('../context/useAuth', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ isDark: false, toggleTheme: vi.fn() })
}));

// 2. Mock Lucide Icons
vi.mock('lucide-react', () => ({
  User: () => <div />, Mail: () => <div />, Lock: () => <div />,
  Eye: () => <div />, EyeOff: () => <div />, ArrowRight: () => <div />,
  Sun: () => <div />, Moon: () => <div />, StickyNote: () => <div />,
  Sparkles: () => <div />, CheckCircle2: () => <div />, Shield: () => <div />,
}));

// 3. NOW import the component
import Signup from '../pages/Signup';

describe('Signup Component', () => {
  test('renders and fills fields', () => {
    // This is the moment of truth
    if (!Signup) {
      console.error("DEBUG: Signup is still undefined. Path: ../pages/Signup");
    }

    render(
      <MemoryRouter>
          <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'Areeba' } });
    expect(nameInput.value).toBe('Areeba');
  });
});