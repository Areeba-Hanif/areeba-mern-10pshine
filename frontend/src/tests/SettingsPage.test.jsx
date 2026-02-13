import '@testing-library/jest-dom'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import axios from 'axios';
import SettingsPage from '../pages/SettingsPage'; 


// ... rest of imports

vi.mock('axios');

describe('SettingsPage - Profile Update', () => {
  const mockUser = { name: 'Original Name', email: 'test@example.com' };
  const mockOnUpdateUser = vi.fn(); // Mock the global update function

  it('shows the update form when "Edit Profile" is clicked', () => {
    render(<SettingsPage userData={mockUser} />);
    
    // Click the edit button
    const editBtn = screen.getByText(/edit profile/i);
    fireEvent.click(editBtn);

    // Matches your actual <label> text in SettingsPage.jsx
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
  });

  it('calls the update API with correct data on submit', async () => {
    axios.patch.mockResolvedValueOnce({ data: { success: true } });
    
    render(<SettingsPage userData={mockUser} onUpdateUser={mockOnUpdateUser} />);
    
    // Open form
    fireEvent.click(screen.getByText(/edit profile/i));

    // Select by Label Text (matches your JSX)
    const nameInput = screen.getByLabelText(/full name/i);
    const currentPass = screen.getByLabelText(/current password/i);
    const nextPass = screen.getByLabelText(/new password/i);
    const saveBtn = screen.getByText(/save changes/i);

    fireEvent.change(nameInput, { target: { value: 'New Awesome Name' } });
    fireEvent.change(currentPass, { target: { value: 'password123' } });
    fireEvent.change(nextPass, { target: { value: 'newsecurepass' } });

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/update-profile'),
        expect.objectContaining({
          name: 'New Awesome Name',
          currentPassword: 'password123',
          nextPassword: 'newsecurepass'
        }),
        expect.any(Object)
      );
    });
  });
});