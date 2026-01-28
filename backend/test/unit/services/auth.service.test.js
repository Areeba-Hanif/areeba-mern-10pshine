const authService = require("../../../src/services/auth.service");
const User = require("../../../src/models/user.model");
const jwt = require("jsonwebtoken");

// Mocking dependencies
jest.mock("../../../src/models/user.model");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  // --- REGISTER TESTS ---
  it("register - success", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "u1", name: "Areeba", email: "a@a.com" });

    const result = await authService.registerUser({ name: "Areeba", email: "a@a.com", password: "password123" });
    
    expect(result.name).toBe("Areeba");
    expect(User.create).toHaveBeenCalled();
  });

  it("register - fail user exists", async () => {
    User.findOne.mockResolvedValue({ email: "a@a.com" });

    await expect(authService.registerUser({ email: "a@a.com" }))
      .rejects.toThrow("User already exists");
  });

  // --- LOGIN TESTS ---
  it("login - success", async () => {
    const mockUser = {
      _id: "u1",
      email: "a@a.com",
      comparePassword: jest.fn().mockResolvedValue(true)
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    jwt.sign.mockReturnValue("mock-token");

    const result = await authService.loginUser({ email: "a@a.com", password: "123" });
    
    expect(result).toHaveProperty("token", "mock-token");
    expect(result.user.email).toBe("a@a.com");
  });

  it("login - fail wrong email", async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    await expect(authService.loginUser({ email: "wrong@a.com" }))
      .rejects.toThrow("Invalid email or password");
  });

  it("login - fail wrong password", async () => {
    const mockUser = { comparePassword: jest.fn().mockResolvedValue(false) };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    await expect(authService.loginUser({ email: "a@a.com", password: "wrong" }))
      .rejects.toThrow("Invalid email or password");
  });

  // --- FORGOT PASSWORD TESTS ---
  it("forgot password - success", async () => {
    const mockUser = {
      getResetPasswordToken: jest.fn().mockReturnValue("raw-token"),
      save: jest.fn().mockResolvedValue(true)
    };
    User.findOne.mockResolvedValue(mockUser);

    const result = await authService.forgotPassword("a@a.com");
    
    expect(result).toBe("raw-token");
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("forgot password - fail email not found", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(authService.forgotPassword("no@a.com"))
      .rejects.toThrow("User not found");
  });

  // --- RESET PASSWORD TESTS ---
  it("reset password - success", async () => {
    const mockUser = {
      _id: "u1",
      password: "old",
      save: jest.fn().mockResolvedValue(true)
    };
    User.findOne.mockResolvedValue(mockUser);

    const result = await authService.resetPassword("token123", "newPass123");
    
    expect(mockUser.password).toBe("newPass123");
    expect(mockUser.save).toHaveBeenCalled();
    expect(result.id).toBe("u1");
  });

  it("reset password - fail invalid token", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(authService.resetPassword("bad-token", "123"))
      .rejects.toThrow("Invalid or expired token");
  });

  // --- GET ME TESTS ---
  it("get me - success", async () => {
    const mockUser = { _id: "u1", name: "Areeba" };
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    const result = await authService.getMe("u1");
    
    expect(result.name).toBe("Areeba");
  });

  it("get me - fail user not found", async () => {
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    await expect(authService.getMe("u1"))
      .rejects.toThrow("User not found");
  });

});