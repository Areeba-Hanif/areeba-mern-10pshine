const authController = require("../../../src/controllers/auth.controller");
const authService = require("../../../src/services/auth.service");

// Correct paths to reach src from test/unit/controllers/
jest.mock("../../../src/services/auth.service");
// Mocking logger in case it doesn't exist or is not needed
jest.mock("../../../src/utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe("Auth Controller Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
    req.body = { name: "John", email: "j@j.com", password: "password123" };
    authService.registerUser.mockResolvedValue({ id: "1", name: "John" });

    await authController.register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});