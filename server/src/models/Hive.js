const mongoose = require("mongoose");

const queenSchema = new mongoose.Schema(
  {
    breed: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      min: 2000
    },
    color_mark: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const hiveSchema = new mongoose.Schema(
  {
    qr_code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["healthy", "weak", "sick", "needs_attention", "archived"],
      default: "healthy"
    },
    queen: {
      type: queenSchema,
      default: {}
    },
    installed_at: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Hive", hiveSchema);
