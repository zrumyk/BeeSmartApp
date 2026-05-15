const mongoose = require("mongoose");

const inspectionDetailsSchema = new mongoose.Schema(
  {
    brood_frames: {
      type: Number,
      required: true,
      min: 0
    },
    honey_frames: {
      type: Number,
      required: true,
      min: 0
    },
    temper: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const inspectionSchema = new mongoose.Schema(
  {
    hive_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    details: {
      type: inspectionDetailsSchema,
      required: true
    },
    client_inspection_id: {
      type: String,
      trim: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

inspectionSchema.index(
  { user_id: 1, client_inspection_id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      client_inspection_id: { $exists: true, $type: "string" }
    }
  }
);

module.exports = mongoose.model("Inspection", inspectionSchema);
