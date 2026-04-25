import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-4 py-3 rounded-xl text-sm">
        <p className="text-purple-300 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}h
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SleepDebt = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [goalHours, setGoalHours] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/sleep");
      setLogs(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Last 7 days logs
  const last7Logs = logs.slice(0, 7);

  // Calculate debt per day
  const debtData = last7Logs.map((log) => ({
    day: dayjs(log.date).format("ddd DD"),
    slept: log.duration,
    goal: goalHours,
    debt: Math.round((goalHours - log.duration) * 10) / 10,
  }));

  // Total debt this week
  const totalDebt = last7Logs.reduce((acc, log) => {
    return acc + Math.max(0, goalHours - log.duration);
  }, 0);

  const roundedDebt = Math.round(totalDebt * 10) / 10;

  // Average sleep this week
  const avgSleep =
    last7Logs.length > 0
      ? Math.round(
          (last7Logs.reduce((a, b) => a + b.duration, 0) / last7Logs.length) *
            10,
        ) / 10
      : 0;

  // Best and worst nights
  const bestNight =
    last7Logs.length > 0
      ? last7Logs.reduce((a, b) => (a.duration > b.duration ? a : b))
      : null;
  const worstNight =
    last7Logs.length > 0
      ? last7Logs.reduce((a, b) => (a.duration < b.duration ? a : b))
      : null;

  // Debt status
  const getDebtStatus = () => {
    if (roundedDebt === 0)
      return {
        label: "No Debt! 🎉",
        color: "#10b981",
        bg: "rgba(16,185,129,0.15)",
        border: "rgba(16,185,129,0.3)",
        message: "Amazing! You are fully caught up on sleep this week!",
        emoji: "🌟",
      };
    if (roundedDebt <= 3)
      return {
        label: "Mild Debt 😐",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.15)",
        border: "rgba(245,158,11,0.3)",
        message: "A little behind. Try sleeping 30 mins earlier tonight.",
        emoji: "😐",
      };
    if (roundedDebt <= 7)
      return {
        label: "Moderate Debt 😟",
        color: "#f97316",
        bg: "rgba(249,115,22,0.15)",
        border: "rgba(249,115,22,0.3)",
        message: "Your body needs more rest. Prioritize sleep this weekend.",
        emoji: "😟",
      };
    return {
      label: "Severe Debt 😰",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.15)",
      border: "rgba(239,68,68,0.3)",
      message:
        "Critical sleep deprivation! This affects your health seriously.",
      emoji: "😰",
    };
  };

  const status = getDebtStatus();

  // Days to recover
  const daysToRecover = roundedDebt > 0 ? Math.ceil(roundedDebt / 1.5) : 0;

  // Chart data
  const chartData = debtData.map((d) => ({
    day: d.day,
    "Hours Slept": d.slept,
    "Sleep Goal": goalHours,
  }));

  const getRecoveryTips = () => {
    if (roundedDebt === 0)
      return [
        { icon: "✅", tip: "Keep maintaining your sleep schedule" },
        { icon: "🌟", tip: "Your sleep health is excellent" },
        { icon: "💪", tip: "You are performing at your best" },
      ];
    return [
      {
        icon: "🛏",
        tip: `Sleep ${Math.min(goalHours + 1.5, 10)} hours tonight to start recovering`,
      },
      { icon: "📵", tip: "Avoid screens 1 hour before bed" },
      { icon: "☕", tip: "No caffeine after 2pm today" },
      { icon: "🧘", tip: "Try a 10 minute meditation before sleep" },
      { icon: "🌡️", tip: "Keep your room cool (65-68°F / 18-20°C)" },
      {
        icon: "⏰",
        tip: `Set a consistent bedtime for next ${daysToRecover} days`,
      },
    ];
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "radial-gradient(ellipse at top,#1a0a3c 0%,#050510 60%)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)",
        }}
      />

      {/* Navbar */}
      <nav className="glass border-b border-white border-opacity-5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 btn-primary rounded-xl flex items-center justify-center text-lg">
            😴
          </div>
          <span className="text-lg font-black">SleepAI</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-outline px-4 py-2 rounded-xl text-xs font-medium"
        >
          ← Dashboard
        </button>
      </nav>

      <div className="px-8 py-10">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <p className="text-purple-400 text-sm font-medium mb-1">
            Health Tracker
          </p>
          <h2 className="text-4xl font-black">Sleep Debt Calculator</h2>
          <p className="text-purple-300 mt-1">
            See how much sleep you owe your body this week
          </p>
        </div>

        {/* Sleep Goal Selector */}
        <div className="glass rounded-2xl p-5 mb-6 animate-fadeInUp">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-purple-300 font-medium uppercase tracking-wider">
              Your Sleep Goal
            </p>
            <span className="text-xl font-black text-purple-300">
              {goalHours}h / night
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="10"
            step="0.5"
            value={goalHours}
            onChange={(e) => setGoalHours(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-purple-400 mt-1">
            <span>6h</span>
            <span>7h</span>
            <span>8h ⭐</span>
            <span>9h</span>
            <span>10h</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center animate-fadeInUp">
            <div className="text-7xl mb-4 animate-float">😴</div>
            <h3 className="text-2xl font-black mb-2">No Sleep Data Yet</h3>
            <p className="text-purple-300 mb-6">
              Log your sleep to calculate your debt
            </p>
            <button
              onClick={() => navigate("/log")}
              className="btn-primary px-6 py-3 rounded-xl font-bold text-sm"
            >
              Log Sleep Now
            </button>
          </div>
        ) : (
          <>
            {/* Main Debt Card */}
            <div
              className="glass rounded-2xl p-8 mb-6 animate-fadeInUp text-center"
              style={{
                background: status.bg,
                border: `1px solid ${status.border}`,
              }}
            >
              <p className="text-6xl mb-3">{status.emoji}</p>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-2"
                style={{ color: status.color }}
              >
                This Week's Sleep Debt
              </p>
              <p
                className="text-7xl font-black mb-2"
                style={{ color: status.color }}
              >
                {roundedDebt}h
              </p>
              <p
                className="font-black text-xl mb-2"
                style={{ color: status.color }}
              >
                {status.label}
              </p>
              <p className="text-purple-300 text-sm max-w-md mx-auto">
                {status.message}
              </p>
              {daysToRecover > 0 && (
                <div className="glass mt-4 px-6 py-3 rounded-xl inline-block">
                  <p className="text-sm text-purple-300">
                    ⏱ Estimated recovery time:
                    <span className="font-black text-white ml-1">
                      {daysToRecover} days
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Avg Sleep",
                  value: `${avgSleep}h`,
                  icon: "⏱️",
                  color: "from-violet-600 to-indigo-600",
                },
                {
                  label: "Sleep Goal",
                  value: `${goalHours}h`,
                  icon: "🎯",
                  color: "from-purple-600 to-pink-600",
                },
                {
                  label: "Best Night",
                  value: bestNight ? `${bestNight.duration}h` : "--",
                  icon: "🌟",
                  color: "from-emerald-600 to-teal-600",
                },
                {
                  label: "Worst Night",
                  value: worstNight ? `${worstNight.duration}h` : "--",
                  icon: "😴",
                  color: "from-red-600 to-pink-600",
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="glass glass-hover rounded-2xl p-5 animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}
                  >
                    {s.icon}
                  </div>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-purple-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
              <h3 className="font-black text-lg mb-1">Sleep vs Goal</h3>
              <p className="text-purple-400 text-xs mb-6">
                Your actual sleep compared to your goal this week
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#a78bfa", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a78bfa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 12]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={goalHours}
                    stroke="rgba(139,92,246,0.4)"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="Hours Slept"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{
                      fill: "#7c3aed",
                      r: 5,
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sleep Goal"
                    stroke="rgba(139,92,246,0.4)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Breakdown */}
            <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
              <h3 className="font-black text-lg mb-4">Daily Breakdown</h3>
              <div className="flex flex-col gap-3">
                {debtData.map((d, i) => {
                  const isDebt = d.debt > 0;
                  const barWidth = Math.min((d.slept / 12) * 100, 100);
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xs text-purple-400 w-14 flex-shrink-0">
                        {d.day}
                      </span>
                      <div className="flex-1 bg-white bg-opacity-5 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{
                            width: `${barWidth}%`,
                            background: isDebt
                              ? "linear-gradient(90deg,#7c3aed,#ef4444)"
                              : "linear-gradient(90deg,#7c3aed,#10b981)",
                          }}
                        >
                          <span className="text-xs font-black text-white">
                            {d.slept}h
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-black w-16 flex-shrink-0 text-right ${
                          isDebt ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        {isDebt ? `-${d.debt}h` : "✅"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recovery Tips */}
            <div className="glass rounded-2xl p-6 animate-fadeInUp">
              <h3 className="font-black text-lg mb-4">
                {roundedDebt === 0 ? "✅ Keep It Up!" : "💡 Recovery Tips"}
              </h3>
              <div className="flex flex-col gap-3">
                {getRecoveryTips().map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <span className="text-xl">{tip.icon}</span>
                    <p className="text-sm text-purple-200">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SleepDebt;
