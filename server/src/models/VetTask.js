const mongoose = require("mongoose");

const vetTaskSchema = new mongoose.Schema(
  {
    hive_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    task_type: {
      type: String,
      required: true,
      trim: true
    },
    medication: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },
    due_date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("VetTask", vetTaskSchema);
