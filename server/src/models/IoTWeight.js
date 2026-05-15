const mongoose = require("mongoose");

const ioTWeightSchema = new mongoose.Schema(
  {
    hive_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true
    },
    weight_kg: {
      type: Number,
      required: true
    },
    battery_level: {
      type: Number,
      min: 0,
      max: 100
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("IoTWeight", ioTWeightSchema);
