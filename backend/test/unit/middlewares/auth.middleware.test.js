const { protect } = require("../../../src/middlewares/auth.middleware");
const jwt = require("jsonwebtoken");
const User = require("../../../src/models/user.model");


jest.mock("../../../src/utils/logger", () => ({
  error: jest.fn(),
  info: jest.fn()
}));
jest.mock("jsonwebtoken");
jest.mock("../../../src/models/user.model");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("block - no token", async () => {
    await protect(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("block - invalid token", async () => {
    req.headers.authorization = "Bearer bad-token";
    jwt.verify.mockImplementation(() => { throw new Error(); });
    await protect(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("pass - valid token", async () => {
    req.headers.authorization = "Bearer good-token";
    jwt.verify.mockReturnValue({ userId: "u1" });
    User.findById.mockResolvedValue({ _id: "u1", name: "User" });

    await protect(req, res, next);
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});