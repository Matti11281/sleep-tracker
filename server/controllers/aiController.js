const getOpenAI = require("../config/openai");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are SleepAI, a friendly sleep coach. Answer questions about sleep in a warm helpful way. Keep answers short and practical.",
        },
        { role: "user", content: message },
      ],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.log("AI chat error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const analyzeSleep = async (req, res) => {
  try {
    const SleepLog = require("../models/SleepLog");
    const Habit = require("../models/Habit");

    const logs = await SleepLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    const habits = await Habit.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are SleepAI, a friendly sleep coach. Analyze sleep data and give 3 short personalized tips.",
        },
        {
          role: "user",
          content: `My last 7 nights: ${JSON.stringify(logs)} My habits: ${JSON.stringify(habits)} Give me tips.`,
        },
      ],
    });
    res.json({ tips: completion.choices[0].message.content });
  } catch (error) {
    console.log("AI analyze error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const generateRoutine = async (req, res) => {
  try {
    const { bedTime, wakeTime } = req.body;
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are SleepAI. Create a 5 step wind down bedtime routine.",
        },
        {
          role: "user",
          content: `Bedtime: ${bedTime}, Wake time: ${wakeTime}. Create my routine.`,
        },
      ],
    });
    res.json({ routine: completion.choices[0].message.content });
  } catch (error) {
    console.log("AI routine error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const generateReportCard = async (req, res) => {
  try {
    const SleepLog = require("../models/SleepLog");
    const Habit = require("../models/Habit");
    const User = require("../models/User");

    const user = await User.findById(req.user._id);

    const logs = await SleepLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);

    const prevLogs = await SleepLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .skip(7)
      .limit(7);

    const habits = await Habit.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);

    if (logs.length === 0) {
      return res.status(400).json({
        message: "Not enough data. Log at least 1 night of sleep first.",
      });
    }

    const avgScore = Math.round(
      logs.reduce((a, b) => a + b.sleepScore, 0) / logs.length,
    );
    const avgDuration =
      Math.round(
        (logs.reduce((a, b) => a + b.duration, 0) / logs.length) * 10,
      ) / 10;

    const prevAvgScore =
      prevLogs.length > 0
        ? Math.round(
            prevLogs.reduce((a, b) => a + b.sleepScore, 0) / prevLogs.length,
          )
        : null;

    const improvement = prevAvgScore !== null ? avgScore - prevAvgScore : null;

    const getGPA = (score) => {
      if (score >= 90) return "A+";
      if (score >= 85) return "A";
      if (score >= 80) return "B+";
      if (score >= 75) return "B";
      if (score >= 70) return "C+";
      if (score >= 65) return "C";
      if (score >= 60) return "D";
      return "F";
    };

    const avgBedHour =
      logs.reduce((acc, log) => {
        const hour = parseInt(log.bedTime.split(":")[0]);
        return acc + (hour < 6 ? hour + 24 : hour);
      }, 0) / logs.length;

    const personality =
      avgBedHour >= 23
        ? "Night Owl 🦉"
        : avgBedHour <= 21
          ? "Early Bird 🐦"
          : "Normal Sleeper 😴";

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `You are SleepAI, an expert sleep analyst.
          Generate a weekly sleep report card in JSON format only.
          No extra text outside JSON. Just valid JSON.
          Use these exact keys:
          {
            "insights": ["insight1", "insight2", "insight3"],
            "prescription": ["step1", "step2", "step3"],
            "nextWeekGoals": ["goal1", "goal2", "goal3"],
            "whatYouDidWell": ["positive1", "positive2"],
            "biggestSleepKiller": "one sentence"
          }`,
        },
        {
          role: "user",
          content: `
            User: ${user.name}
            Sleep goal: ${user.sleepGoalHours || 8} hours
            Last 7 nights: ${JSON.stringify(logs)}
            Habits: ${JSON.stringify(habits)}
            Avg score: ${avgScore}
            Avg duration: ${avgDuration}h
            Personality: ${personality}
            Improvement: ${improvement !== null ? improvement + " points" : "No previous data"}
            Generate personalized report card JSON.
          `,
        },
      ],
    });

    let aiData = {};
    try {
      const text = completion.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      aiData = JSON.parse(clean);
    } catch {
      aiData = {
        insights: [
          `You averaged ${avgDuration} hours of sleep this week`,
          `Your best night scored ${Math.max(...logs.map((l) => l.sleepScore))} points`,
          "Keep tracking to unlock more insights",
        ],
        prescription: [
          "Maintain a consistent sleep schedule",
          "Avoid screens 1 hour before bed",
          `Try to sleep by ${user.bedTime || "11:00 PM"}`,
        ],
        nextWeekGoals: [
          `Hit your ${user.sleepGoalHours || 8}h sleep goal on 5 nights`,
          "Keep stress levels below 3",
          "Exercise at least 3 times this week",
        ],
        whatYouDidWell: [
          "You logged your sleep consistently",
          "You are taking your sleep health seriously",
        ],
        biggestSleepKiller:
          "Inconsistent sleep schedule is your main challenge",
      };
    }

    res.json({
      gpa: getGPA(avgScore),
      score: avgScore,
      avgDuration,
      improvement,
      personality,
      streak: user.streak || 0,
      totalLogs: logs.length,
      ...aiData,
    });
  } catch (error) {
    console.log("Report card error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  chatWithAI,
  analyzeSleep,
  generateRoutine,
  generateReportCard,
};
