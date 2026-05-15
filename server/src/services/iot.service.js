const { Hive, IoTWeight } = require("../models");
const ApiError = require("../utils/ApiError");

const addWeightTelemetry = async (payload) => {
  const hive = await Hive.findById(payload.hive_id);
  if (!hive) {
    throw new ApiError(404, "Hive not found");
  }

  const timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();

  const previous = await IoTWeight.findOne({
    hive_id: payload.hive_id,
    timestamp: { $lte: timestamp, $gte: new Date(timestamp.getTime() - 60 * 60 * 1000) }
  }).sort({ timestamp: -1 });

  const telemetry = await IoTWeight.create({
    hive_id: payload.hive_id,
    weight_kg: payload.weight_kg,
    battery_level: payload.battery_level,
    timestamp
  });

  if (previous) {
    const drop = previous.weight_kg - telemetry.weight_kg;
    if (drop > 2) {
      // eslint-disable-next-line no-console
      console.log("Увага! Можливе роїння або крадіжка");
    }
  }

  return telemetry;
};

const calculateDailyYield = async (hiveId) => {
  const hive = await Hive.findById(hiveId);
  if (!hive) {
    throw new ApiError(404, "Hive not found");
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const measurements = await IoTWeight.find({
    hive_id: hiveId,
    timestamp: { $gte: start, $lte: end }
  }).sort({ timestamp: 1 });

  if (measurements.length < 2) {
    return {
      hive_id: hiveId,
      date: start,
      daily_gain_kg: 0,
      measurements_count: measurements.length
    };
  }

  const first = measurements[0];
  const last = measurements[measurements.length - 1];

  return {
    hive_id: hiveId,
    date: start,
    daily_gain_kg: Number((last.weight_kg - first.weight_kg).toFixed(3)),
    start_weight_kg: first.weight_kg,
    end_weight_kg: last.weight_kg,
    measurements_count: measurements.length
  };
};

module.exports = {
  addWeightTelemetry,
  calculateDailyYield
};
