const Habit = require("../models/Habit");

const addHabit = async (req, res) => {
  try {
    console.log("Habit request body:", req.body);
    console.log("User ID:", req.user._id);

    const {
      date,
      caffeineAfter2pm,
      screenTimeBeforeBed,
      exercisedToday,
      alcoholConsumed,
      stressLevel,
    } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const existing = await Habit.findOne({
      userId: req.user._id,
      date: date,
    });

    if (existing) {
      const updated = await Habit.findByIdAndUpdate(
        existing._id,
        {
          caffeineAfter2pm: caffeineAfter2pm || false,
          screenTimeBeforeBed: screenTimeBeforeBed || false,
          exercisedToday: exercisedToday || false,
          alcoholConsumed: alcoholConsumed || false,
          stressLevel: stressLevel || 1,
        },
        { new: true },
      );
      console.log("Habit updated:", updated);
      return res.json(updated);
    }

    const habit = await Habit.create({
      userId: req.user._id,
      date,
      caffeineAfter2pm: caffeineAfter2pm || false,
      screenTimeBeforeBed: screenTimeBeforeBed || false,
      exercisedToday: exercisedToday || false,
      alcoholConsumed: alcoholConsumed || false,
      stressLevel: stressLevel || 1,
    });

    console.log("Habit created:", habit);
    res.status(201).json(habit);
  } catch (error) {
    console.log("Habit error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(habits);
  } catch (error) {
    console.log("Get habits error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addHabit, getHabits };
