const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

const validateObjectId = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return next(new ApiError(400, `Invalid ObjectId for parameter: ${paramName}`));
  }
  return next();
};

module.exports = validateObjectId;
