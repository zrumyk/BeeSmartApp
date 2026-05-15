const asyncHandler = require("../middlewares/asyncHandler.middleware");
const iotService = require("../services/iot.service");

const receiveWeightWebhook = asyncHandler(async (req, res) => {
  const telemetry = await iotService.addWeightTelemetry(req.body);
  res.status(201).json({
    success: true,
    message: "Telemetry accepted",
    data: telemetry
  });
});

const getHiveDailyYield = asyncHandler(async (req, res) => {
  const result = await iotService.calculateDailyYield(req.params.hiveId);
  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  receiveWeightWebhook,
  getHiveDailyYield
};
