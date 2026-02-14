import { TextEncoder, TextDecoder } from 'util';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, test, expect, describe, beforeEach } from 'vitest';
import Dashboard from "../pages/Dashboard";
import api from "../services/api";
import { AuthProvider } from '../context/useAuth'; // Ensure this path is correct
import '@testing-library/jest-dom/vitest';

// Fix environment for JSDOM
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock useAuth
vi.mock("../context/useAuth", () => ({
  // We mock the provider AND the hook
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    userData: { name: "Areeba" },
    login: vi.fn(),
    logout: vi.fn(),
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

// Mock API
vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

const mockNotes = [
  {
    _id: "1",
    title: "Test Note",
    content: "This is a test content",
    tags: ["Personal"],
    createdAt: new Date().toISOString(),
    isDeleted: false,
    isPinned: false,
    isFavorite: false,
  },
];

const renderDashboard = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Dashboard Component", () => {
beforeEach(() => {
  // 1. Mock the token
  Storage.prototype.getItem = vi.fn((key) => {
    if (key === 'token') return 'fake-token-123';
    return null;
  });

  // 2. Mock the default GET response so notes actually appear!
  
 api.get.mockResolvedValue({
  data: {
    success: true,
    data: mockNotes // This must be an array
  }
});

  vi.clearAllMocks();
});

  test("fetches and displays notes on mount", async () => {
    renderDashboard();
    const noteTitle = await screen.findByText("Test Note");
    expect(noteTitle).toBeInTheDocument();
  });

  test("opens create note modal when 'New Note' is clicked", async () => {
    renderDashboard();
    const newNoteBtn = await screen.findByRole('button', { name: /New Note/i });
    fireEvent.click(newNoteBtn);

    const modalTitle = await screen.findByPlaceholderText(/Note Title.../i);
    expect(modalTitle).toBeInTheDocument();
  });

  describe('Note Operations', () => {
    
    test('successfully creates a new note', async () => {
      // Mock the POST response
      const newNote = { ...mockNotes[0], _id: "2", title: "Test Note Title" };
      api.post.mockResolvedValue({ data: { success: true, data: newNote } });

      renderDashboard();

      // Open Modal
      const newNoteBtn = await screen.findByRole('button', { name: /New Note/i });
      fireEvent.click(newNoteBtn);

      // Fill Form
      const titleInput = screen.getByPlaceholderText(/Note Title.../i);
      fireEvent.change(titleInput, { target: { value: 'Test Note Title' } });

      // Handle ReactQuill (finding by class since it doesn't have a simple input tag)
      const editor = document.querySelector('.ql-editor');
      fireEvent.input(editor, { target: { innerHTML: 'This is some brilliant content.' } });

      // Click Create
      const saveBtn = screen.getByRole('button', { name: /Create Note/i });
      fireEvent.click(saveBtn);

      // Verify
      await waitFor(() => {
        expect(api.post).toHaveBeenCalled();
        expect(screen.getByText('Test Note Title')).toBeInTheDocument();
      });
    });

    test('opens edit modal with existing note data', async () => {
      renderDashboard();
      
      const editBtn = await screen.findAllByTestId('edit-note-btn'); 
      fireEvent.click(editBtn[0]);
      
      const titleInput = screen.getByPlaceholderText(/Note Title.../i);
      expect(titleInput.value).toBe("Test Note");
    });

test('deletes a note after confirmation', async () => {
  // 1. Mock the confirm (though handleMoveToTrash doesn't use it, 
  // keeping it doesn't hurt if you add it to the UI later)
  const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
  
  // 2. Mock the soft delete API response
  api.put.mockResolvedValue({ 
    data: { success: true, data: { ...mockNotes[0], isDeleted: true } } 
  });

  renderDashboard();

  // 3. CRITICAL: Wait for the note to appear in the DOM first
  // This ensures the API call finished and the NoteCard is rendered
  await screen.findByText("Test Note"); 

  // 4. Now find the buttons
  const deleteBtns = await screen.findAllByTestId('delete-note-btn');
  fireEvent.click(deleteBtns[0]);

  // 5. Verify it's gone
  await waitFor(() => {
    expect(screen.queryByText('Test Note')).not.toBeInTheDocument();
  });

  confirmSpy.mockRestore();
});
  });
});