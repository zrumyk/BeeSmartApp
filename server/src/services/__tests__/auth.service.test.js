jest.mock("../../models", () => ({
  User: {
    findOne: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    find: jest.fn()
  }
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn()
}));

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const ApiError = require("../../utils/ApiError");
const { registerUser, loginUser, getBeekeepers } = require("../auth.service");

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("registers user when bootstrapping first admin", async () => {
      User.findOne.mockResolvedValue(null);
      User.countDocuments.mockResolvedValue(0);
      bcrypt.hash.mockResolvedValue("hashed-password");
      User.create.mockResolvedValue({
        toObject: () => ({ _id: "u1", email: "admin@admin.com", role: "admin", password: "hashed-password" })
      });

      const result = await registerUser(
        { email: "admin@admin.com", password: "admin", role: "admin" },
        null
      );

      expect(User.create).toHaveBeenCalledWith({
        email: "admin@admin.com",
        password: "hashed-password",
        role: "admin"
      });
      expect(result).toEqual({ _id: "u1", email: "admin@admin.com", role: "admin" });
    });

    it("throws 409 when email already exists", async () => {
      User.findOne.mockResolvedValue({ _id: "existing" });

      await expect(
        registerUser({ email: "used@beesmart.com", password: "123", role: "beekeeper" }, { role: "admin" })
      ).rejects.toMatchObject({ statusCode: 409, message: "User with this email already exists" });
    });

    it("throws 403 when non-admin tries to register non-bootstrap user", async () => {
      User.findOne.mockResolvedValue(null);
      User.countDocuments.mockResolvedValue(1);

      await expect(
        registerUser({ email: "new@beesmart.com", password: "123", role: "beekeeper" }, null)
      ).rejects.toMatchObject({ statusCode: 403, message: "Only admin can register new users" });
    });
  });

  describe("loginUser", () => {
    it("returns token and user data for valid credentials", async () => {
      User.findOne.mockResolvedValue({
        _id: "u2",
        role: "beekeeper",
        password: "hash",
        toObject: () => ({ _id: "u2", email: "test@test.com", role: "beekeeper", password: "hash" })
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token-123");

      const result = await loginUser({ email: "test@test.com", password: "123456" });

      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        token: "token-123",
        user: { _id: "u2", email: "test@test.com", role: "beekeeper" }
      });
    });

    it("throws 401 when user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(loginUser({ email: "missing@test.com", password: "123" })).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password"
      });
    });

    it("throws 401 when password is invalid", async () => {
      User.findOne.mockResolvedValue({ password: "hash" });
      bcrypt.compare.mockResolvedValue(false);

      await expect(loginUser({ email: "test@test.com", password: "wrong" })).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password"
      });
    });
  });

  describe("getBeekeepers", () => {
    it("returns sorted beekeeper selection", async () => {
      const sort = jest.fn().mockResolvedValue([{ _id: "u1", name: "A", email: "a@test.com", role: "beekeeper" }]);
      const select = jest.fn().mockReturnValue({ sort });
      User.find.mockReturnValue({ select });

      const result = await getBeekeepers();

      expect(User.find).toHaveBeenCalledWith({ role: "beekeeper" });
      expect(select).toHaveBeenCalledWith("name email role");
      expect(sort).toHaveBeenCalledWith({ name: 1 });
      expect(result).toEqual([{ _id: "u1", name: "A", email: "a@test.com", role: "beekeeper" }]);
    });
  });
});
