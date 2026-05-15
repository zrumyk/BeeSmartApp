const asyncHandler = require("../middlewares/asyncHandler.middleware");
const locationService = require("../services/location.service");

const createLocation = asyncHandler(async (req, res) => {
  const location = await locationService.createLocation(req.body);
  res.status(201).json({
    success: true,
    message: "Location created successfully",
    data: location
  });
});

const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await locationService.getLocations();
  res.status(200).json({
    success: true,
    data: locations
  });
});

const getLocationById = asyncHandler(async (req, res) => {
  const location = await locationService.getLocationById(req.params.id);
  res.status(200).json({
    success: true,
    data: location
  });
});

const updateLocation = asyncHandler(async (req, res) => {
  const location = await locationService.updateLocation(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Location updated successfully",
    data: location
  });
});

const deleteLocation = asyncHandler(async (req, res) => {
  await locationService.deleteLocation(req.params.id);
  res.status(200).json({
    success: true,
    message: "Location deleted successfully"
  });
});

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};
