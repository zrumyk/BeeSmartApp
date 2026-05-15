const { Inspection, Hive } = require("../models");
const ApiError = require("../utils/ApiError");

const isDuplicateError = (error) =>
  error && (error.code === 11000 || error?.message?.includes("duplicate key"));

const ensureHiveExists = async (hiveId) => {
  const hiveExists = await Hive.exists({ _id: hiveId });
  if (!hiveExists) {
    throw new ApiError(404, `Hive not found: ${hiveId}`);
  }
};

const createInspection = async ({ hive_id, date, details, userId, client_inspection_id }) => {
  await ensureHiveExists(hive_id);
  return Inspection.create({
    hive_id,
    user_id: userId,
    date: date || new Date(),
    details,
    client_inspection_id
  });
};

const getHiveInspectionHistory = async (hiveId) =>
  Inspection.find({ hive_id: hiveId })
    .populate("user_id", "name email role")
    .sort({ date: -1, createdAt: -1 });

const syncInspections = async (items, userId) => {
  const created = [];
  const failed = [];
  const duplicates = [];

  // Sequential insert keeps per-item status deterministic for offline sync.
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    try {
      const record = await createInspection({ ...item, userId });
      created.push(record);
    } catch (error) {
      if (isDuplicateError(error)) {
        duplicates.push({
          hive_id: item.hive_id,
          date: item.date,
          client_inspection_id: item.client_inspection_id
        });
        continue;
      }

      failed.push({
        hive_id: item.hive_id,
        date: item.date,
        client_inspection_id: item.client_inspection_id,
        reason: error.message
      });
    }
  }

  return {
    total: items.length,
    saved: created.length,
    duplicates: duplicates.length,
    failed: failed.length,
    created,
    ignored: duplicates,
    errors: failed
  };
};

module.exports = {
  createInspection,
  getHiveInspectionHistory,
  syncInspections
};
