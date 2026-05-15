const asyncHandler = require("../middlewares/asyncHandler.middleware");
const inspectionService = require("../services/inspection.service");

const createInspection = asyncHandler(async (req, res) => {
  const inspection = await inspectionService.createInspection({
    ...req.body,
    userId: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Inspection created successfully",
    data: inspection
  });
});

const getHiveHistory = asyncHandler(async (req, res) => {
  const inspections = await inspectionService.getHiveInspectionHistory(req.params.hiveId);
  res.status(200).json({
    success: true,
    data: inspections
  });
});

const syncInspections = asyncHandler(async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : req.body.inspections;
  const syncResult = await inspectionService.syncInspections(payload, req.user._id);
  res.status(200).json({
    success: true,
    message: "Sync completed",
    data: syncResult
  });
});

module.exports = {
  createInspection,
  getHiveHistory,
  syncInspections
};
