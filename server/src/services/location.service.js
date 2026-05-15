const { Location } = require("../models");
const ApiError = require("../utils/ApiError");

const createLocation = async (payload) => Location.create(payload);

const getLocations = async () => Location.find().sort({ createdAt: -1 });

const getLocationById = async (id) => {
  const location = await Location.findById(id);
  if (!location) {
    throw new ApiError(404, "Location not found");
  }
  return location;
};

const updateLocation = async (id, payload) => {
  const location = await Location.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  return location;
};

const deleteLocation = async (id) => {
  const location = await Location.findByIdAndDelete(id);
  if (!location) {
    throw new ApiError(404, "Location not found");
  }
};

module.exports = {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};
