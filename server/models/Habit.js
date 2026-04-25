const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    caffeineAfter2pm: { type: Boolean, default: false },
    screenTimeBeforeBed: { type: Boolean, default: false },
    exercisedToday: { type: Boolean, default: false },
    alcoholConsumed: { type: Boolean, default: false },
    stressLevel: { type: Number, default: 1, min: 1, max: 5 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Habit", habitSchema);
