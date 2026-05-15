const asyncHandler = require("../middlewares/asyncHandler.middleware");
const hiveService = require("../services/hive.service");

const createHive = asyncHandler(async (req, res) => {
  const hive = await hiveService.createHive(req.body);
  res.status(201).json({
    success: true,
    message: "Hive created successfully",
    data: hive
  });
});

const getAllHives = asyncHandler(async (req, res) => {
  const hives = await hiveService.getHives();
  res.status(200).json({
    success: true,
    data: hives
  });
});

const getHiveById = asyncHandler(async (req, res) => {
  const hive = await hiveService.getHiveById(req.params.id);
  res.status(200).json({
    success: true,
    data: hive
  });
});

const updateHive = asyncHandler(async (req, res) => {
  const hive = await hiveService.updateHive(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Hive updated successfully",
    data: hive
  });
});

const deleteHive = asyncHandler(async (req, res) => {
  await hiveService.deleteHive(req.params.id);
  res.status(200).json({
    success: true,
    message: "Hive deleted successfully"
  });
});

const getHiveByQrCode = asyncHandler(async (req, res) => {
  const hive = await hiveService.getHiveByQrCode(req.params.qr_code);
  res.status(200).json({
    success: true,
    data: hive
  });
});

const getSickHives = asyncHandler(async (req, res) => {
  const hives = await hiveService.getSickHives();
  res.status(200).json({
    success: true,
    data: hives
  });
});

const getHiveProductivity = asyncHandler(async (req, res) => {
  const productivity = await hiveService.calculateHiveProductivity(req.params.id);
  res.status(200).json({
    success: true,
    data: productivity
  });
});

module.exports = {
  createHive,
  getAllHives,
  getHiveById,
  updateHive,
  deleteHive,
  getHiveByQrCode,
  getSickHives,
  getHiveProductivity
};
