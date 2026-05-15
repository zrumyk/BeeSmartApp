const asyncHandler = require("../middlewares/asyncHandler.middleware");
const { registerUser, loginUser, getBeekeepers } = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body, req.user);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

const listBeekeepers = asyncHandler(async (req, res) => {
  const beekeepers = await getBeekeepers();
  res.status(200).json({
    success: true,
    data: beekeepers
  });
});

module.exports = {
  register,
  login,
  me,
  listBeekeepers
};
