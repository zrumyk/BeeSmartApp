const { Hive, VetTask, Inspection, IoTWeight, Location } = require("../models");
const ApiError = require("../utils/ApiError");

const ensureLocationExists = async (locationId) => {
  const locationExists = await Location.exists({ _id: locationId });
  if (!locationExists) {
    throw new ApiError(404, "Location not found");
  }
};

const createHive = async (payload) => {
  await ensureLocationExists(payload.location_id);
  return Hive.create(payload);
};

const getHives = async () => Hive.find().populate("location_id");

const getHiveById = async (id) => {
  const hive = await Hive.findById(id).populate("location_id");
  if (!hive) {
    throw new ApiError(404, "Hive not found");
  }
  return hive;
};

const updateHive = async (id, payload) => {
  if (payload.location_id) {
    await ensureLocationExists(payload.location_id);
  }

  const hive = await Hive.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  }).populate("location_id");

  if (!hive) {
    throw new ApiError(404, "Hive not found");
  }

  return hive;
};

const deleteHive = async (id) => {
  const hive = await Hive.findByIdAndDelete(id);
  if (!hive) {
    throw new ApiError(404, "Hive not found");
  }
};

const getHiveByQrCode = async (qrCode) => {
  const hive = await Hive.findOne({ qr_code: qrCode }).populate("location_id");
  if (!hive) {
    throw new ApiError(404, "Hive not found by provided QR code");
  }
  return hive;
};

const getSickHives = async () => {
  const [sickByStatus, hivesWithPendingVetTasks] = await Promise.all([
    Hive.find({ status: { $in: ["sick", "needs_attention", "weak"] } }).populate("location_id"),
    VetTask.find({ status: "pending" }).distinct("hive_id")
  ]);

  const hivesByPendingTasks = await Hive.find({
    _id: { $in: hivesWithPendingVetTasks }
  }).populate("location_id");

  const map = new Map();
  [...sickByStatus, ...hivesByPendingTasks].forEach((hive) => {
    map.set(String(hive._id), hive);
  });

  return Array.from(map.values());
};

const calculateHiveProductivity = async (hiveId) => {
  const hive = await Hive.findById(hiveId);
  if (!hive) {
    throw new ApiError(404, "Hive not found");
  }

  const [inspections, weights] = await Promise.all([
    Inspection.find({ hive_id: hiveId }).sort({ date: -1 }).limit(30),
    IoTWeight.find({ hive_id: hiveId }).sort({ timestamp: -1 }).limit(100)
  ]);

  const avgHoneyFrames =
    inspections.length > 0
      ? inspections.reduce((sum, item) => sum + (item.details?.honey_frames || 0), 0) / inspections.length
      : 0;

  let dailyGain = 0;
  if (weights.length >= 2) {
    const oldest = weights[weights.length - 1];
    const latest = weights[0];
    const daysDiff = Math.max(1, (latest.timestamp - oldest.timestamp) / (1000 * 60 * 60 * 24));
    dailyGain = (latest.weight_kg - oldest.weight_kg) / daysDiff;
  }

  // Heuristic score from 1 to 10 based on inspection and weight dynamics.
  const honeyScore = Math.min(10, Math.max(0, avgHoneyFrames / 1.2));
  const gainScore = Math.min(10, Math.max(0, dailyGain * 2 + 5));
  const score = Math.max(1, Math.min(10, Number(((honeyScore * 0.6 + gainScore * 0.4)).toFixed(1))));

  return {
    hive_id: hiveId,
    score,
    metrics: {
      inspections_count: inspections.length,
      average_honey_frames: Number(avgHoneyFrames.toFixed(2)),
      estimated_daily_gain_kg: Number(dailyGain.toFixed(3))
    }
  };
};

module.exports = {
  createHive,
  getHives,
  getHiveById,
  updateHive,
  deleteHive,
  getHiveByQrCode,
  getSickHives,
  calculateHiveProductivity
};
