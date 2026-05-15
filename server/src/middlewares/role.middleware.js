const ApiError = require("../utils/ApiError");

const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden. Insufficient permissions"));
  }

  return next();
};

const isAdmin = allowRoles("admin");
const isBeekeeper = allowRoles("beekeeper");

module.exports = {
  allowRoles,
  isAdmin,
  isBeekeeper
};
