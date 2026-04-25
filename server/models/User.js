const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sleepGoalHours: { type: Number, default: 8 },
    wakeUpTime: { type: String, default: "07:00" },
    bedTime: { type: String, default: "23:00" },
    streak: { type: Number, default: 0 },
    lastLogDate: { type: Date, default: null },
    badges: { type: [String], default: [] },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
