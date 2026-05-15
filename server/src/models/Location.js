const mongoose = require("mongoose");

const coordinatesSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      type: coordinatesSchema,
      required: true
    },
    max_capacity: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Location", locationSchema);
