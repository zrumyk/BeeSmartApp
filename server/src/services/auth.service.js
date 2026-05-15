const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

const createToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const registerUser = async (payload, currentUser) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const adminsCount = await User.countDocuments({ role: "admin" });
  const isBootstrappingAdmin = adminsCount === 0 && payload.role === "admin";
  const isAuthorizedAdmin = currentUser && currentUser.role === "admin";

  if (!isBootstrappingAdmin && !isAuthorizedAdmin) {
    throw new ApiError(403, "Only admin can register new users");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    ...payload,
    password: hashedPassword
  });

  const userData = user.toObject();
  delete userData.password;
  return userData;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = createToken(user._id, user.role);
  const userData = user.toObject();
  delete userData.password;

  return { token, user: userData };
};

const getBeekeepers = async () =>
  User.find({ role: "beekeeper" })
    .select("name email role")
    .sort({ name: 1 });

module.exports = {
  registerUser,
  loginUser,
  getBeekeepers
};
