const mongoose = require("mongoose");

const sleepLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    bedTime: {
      type: String,
      required: true,
    },
    wakeTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    quality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
      default: "",
    },
    sleepScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SleepLog", sleepLogSchema);
