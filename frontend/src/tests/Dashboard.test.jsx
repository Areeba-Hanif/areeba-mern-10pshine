import { TextEncoder, TextDecoder } from 'util';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, test, expect, describe, beforeEach } from 'vitest';
import Dashboard from "../pages/Dashboard";
import api from "../services/api";
import '@testing-library/jest-dom/vitest';

// Fix environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock useAuth
vi.mock("../context/useAuth", () => ({
  useAuth: () => ({
    user: { name: "Areeba" },
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

const renderDashboard = () =>
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetches and displays notes on mount", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: mockNotes } });

    renderDashboard();

    const noteTitle = await screen.findByText("Test Note");
    expect(noteTitle).toBeInTheDocument();
  });

  test("opens create note modal when 'New Note' is clicked", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [] } });

    renderDashboard();

    const newNoteBtn = await screen.findByText(/New Note/i);
    fireEvent.click(newNoteBtn);

    const modalTitle = await screen.findByPlaceholderText(/Note Title/i);
    expect(modalTitle).toBeInTheDocument();
  });

  test("submits new note successfully", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [] } });
    api.post.mockResolvedValue({ data: { data: mockNotes[0] } });

    renderDashboard();

    fireEvent.click(await screen.findByText(/New Note/i));
    
    const titleInput = screen.getByPlaceholderText(/Note Title/i);
    fireEvent.change(titleInput, { target: { value: "New Test Note" } });
    
    const createBtn = screen.getByText(/Create Note/i);
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  test("logout clears localStorage", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [] } });
    const spy = vi.spyOn(Storage.prototype, "clear");

    renderDashboard();

    const logoutBtns = await screen.findAllByText(/Logout/i);
    fireEvent.click(logoutBtns[0]);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});