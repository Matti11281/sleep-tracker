const SleepLog = require("../models/SleepLog");
const User = require("../models/User");
const calculateSleepScore = require("../utils/sleepScore");

const recalculateStreak = async (userId) => {
  const logs = await SleepLog.find({ userId }).sort({ date: -1 });

  if (logs.length === 0) {
    await User.updateOne({ _id: userId }, { $set: { streak: 0 } });
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date);
    logDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (logDate.getTime() < checkDate.getTime()) {
      break;
    }
  }

  await User.updateOne(
    { _id: userId },
    { $set: { streak, lastLogDate: logs[0].date } },
  );

  return streak;
};

const addSleepLog = async (req, res) => {
  try {
    const { date, bedTime, wakeTime, quality, notes } = req.body;

    if (!bedTime || !wakeTime || !quality || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bed = new Date(`2000-01-01T${bedTime}:00`);
    let wake = new Date(`2000-01-01T${wakeTime}:00`);
    if (wake < bed) wake.setDate(wake.getDate() + 1);
    const duration = (wake - bed) / (1000 * 60 * 60);
    const sleepScore = calculateSleepScore(duration, quality);

    const sleepLog = await SleepLog.create({
      userId: req.user._id,
      date,
      bedTime,
      wakeTime,
      duration: Math.round(duration * 10) / 10,
      quality: Number(quality),
      notes: notes || "",
      sleepScore,
    });

    const user = await User.findById(req.user._id);
    const newBadges = [...(user.badges || [])];

    const newStreak = await recalculateStreak(req.user._id);

    if (newStreak >= 3 && !newBadges.includes("3-day-streak"))
      newBadges.push("3-day-streak");
    if (newStreak >= 7 && !newBadges.includes("week-warrior"))
      newBadges.push("week-warrior");
    if (newStreak >= 30 && !newBadges.includes("sleep-master"))
      newBadges.push("sleep-master");
    if (sleepScore >= 90 && !newBadges.includes("perfect-sleep"))
      newBadges.push("perfect-sleep");
    if (
      duration >= (user.sleepGoalHours || 8) &&
      !newBadges.includes("goal-crusher")
    )
      newBadges.push("goal-crusher");

    await User.updateOne(
      { _id: req.user._id },
      { $set: { badges: newBadges } },
    );

    res.status(201).json({
      sleepLog,
      streak: newStreak,
      badges: newBadges,
    });
  } catch (error) {
    console.log("Sleep log error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getSleepLogs = async (req, res) => {
  try {
    const logs = await SleepLog.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWeeklySleep = async (req, res) => {
  try {
    const logs = await SleepLog.find({ userId: req.user._id })
      .sort({ date: 1 })
      .limit(7);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSleepStats = async (req, res) => {
  try {
    const logs = await SleepLog.find({ userId: req.user._id });
    const user = await User.findById(req.user._id);

    if (logs.length === 0) {
      return res.json({
        avgDuration: 0,
        avgScore: 0,
        totalLogs: 0,
        bestNight: null,
        streak: user.streak || 0,
        badges: user.badges || [],
      });
    }

    const avgDuration = logs.reduce((a, b) => a + b.duration, 0) / logs.length;
    const avgScore = logs.reduce((a, b) => a + b.sleepScore, 0) / logs.length;
    const bestNight = logs.reduce((a, b) =>
      a.sleepScore > b.sleepScore ? a : b,
    );

    res.json({
      avgDuration: Math.round(avgDuration * 10) / 10,
      avgScore: Math.round(avgScore),
      totalLogs: logs.length,
      bestNight,
      streak: user.streak || 0,
      badges: user.badges || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSleepLog = async (req, res) => {
  try {
    const updated = await SleepLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSleepLog = async (req, res) => {
  try {
    await SleepLog.findByIdAndDelete(req.params.id);
    const newStreak = await recalculateStreak(req.user._id);
    res.json({ message: "Deleted", streak: newStreak });
  } catch (error) {
    console.log("Delete error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSleepLog,
  getSleepLogs,
  getWeeklySleep,
  getSleepStats,
  updateSleepLog,
  deleteSleepLog,
};
