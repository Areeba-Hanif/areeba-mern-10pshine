const noteController = require("../../../src/controllers/note.controller");
const noteService = require("../../../src/services/note.service");

// 1. Mock the service used by the controller
jest.mock("../../../src/services/note.service");

// 2. Fix the logger mock
// This provides a manual mock so Jest doesn't look for the real file's metadata
jest.mock("../../../src/utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe("Note Controller Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    // Re-creating req/res objects for every test to ensure isolation
    req = { 
      body: {}, 
      params: {}, 
      query: {}, 
      user: { _id: "user123" } 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a note successfully", async () => {
    req.body = { title: "Test Note", content: "This is a test" };
    
    // Mocking the service response
    noteService.createNote.mockResolvedValue({ 
      _id: "note123", 
      ...req.body, 
      user: "user123" 
    });

    await noteController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: "Note created successfully"
    }));
  });
});