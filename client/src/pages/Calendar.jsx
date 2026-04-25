import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import dayjs from "dayjs";

const Calendar = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

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

  const getLogForDate = (dateStr) => {
    return logs.find((log) => dayjs(log.date).format("YYYY-MM-DD") === dateStr);
  };

  const getScoreStyle = (score) => {
    if (score >= 80)
      return {
        bg: "rgba(16,185,129,0.25)",
        border: "rgba(16,185,129,0.5)",
        color: "#10b981",
        label: "Excellent",
      };
    if (score >= 60)
      return {
        bg: "rgba(245,158,11,0.25)",
        border: "rgba(245,158,11,0.5)",
        color: "#f59e0b",
        label: "Good",
      };
    return {
      bg: "rgba(239,68,68,0.25)",
      border: "rgba(239,68,68,0.5)",
      color: "#ef4444",
      label: "Poor",
    };
  };

  const getDays = () => {
    const startDay = currentMonth.startOf("month").day();
    const daysInMonth = currentMonth.daysInMonth();
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const monthLogs = logs.filter(
    (log) =>
      dayjs(log.date).format("YYYY-MM") === currentMonth.format("YYYY-MM"),
  );

  const stats =
    monthLogs.length > 0
      ? {
          total: monthLogs.length,
          avgScore: Math.round(
            monthLogs.reduce((a, b) => a + b.sleepScore, 0) / monthLogs.length,
          ),
          avgDuration:
            Math.round(
              (monthLogs.reduce((a, b) => a + b.duration, 0) /
                monthLogs.length) *
                10,
            ) / 10,
          bestScore: Math.max(...monthLogs.map((l) => l.sleepScore)),
        }
      : null;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = getDays();
  const todayStr = dayjs().format("YYYY-MM-DD");

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
            🗓️
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
            Visual overview
          </p>
          <h2 className="text-4xl font-black">Sleep Calendar</h2>
          <p className="text-purple-300 mt-1">
            Color coded sleep quality for every night
          </p>
        </div>

        {/* Month Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Nights Logged", value: stats.total, icon: "📊" },
              { label: "Avg Score", value: stats.avgScore, icon: "⭐" },
              {
                label: "Avg Duration",
                value: `${stats.avgDuration}h`,
                icon: "⏱️",
              },
              { label: "Best Score", value: stats.bestScore, icon: "🏆" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="glass rounded-2xl p-4 animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="text-2xl font-black mt-2">{s.value}</p>
                <p className="text-purple-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Calendar */}
        <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                setSelectedLog(null);
                setCurrentMonth((prev) => prev.subtract(1, "month"));
              }}
              className="btn-outline px-4 py-2 rounded-xl text-sm font-bold"
            >
              ← Prev
            </button>
            <h3 className="text-xl font-black">
              {currentMonth.format("MMMM YYYY")}
            </h3>
            <button
              onClick={() => {
                setSelectedLog(null);
                setCurrentMonth((prev) => prev.add(1, "month"));
              }}
              className="btn-outline px-4 py-2 rounded-xl text-sm font-bold"
            >
              Next →
            </button>
          </div>

          {/* Week Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-xs text-purple-400 font-medium py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="aspect-square" />;
                }

                const dateStr = currentMonth.date(day).format("YYYY-MM-DD");
                const log = getLogForDate(dateStr);
                const style = log ? getScoreStyle(log.sleepScore) : null;
                const isToday = dateStr === todayStr;
                const isSelected =
                  selectedLog &&
                  dayjs(selectedLog.date).format("YYYY-MM-DD") === dateStr;

                return (
                  <div
                    key={`day-${dateStr}`}
                    onClick={() => {
                      if (log) {
                        setSelectedLog(isSelected ? null : log);
                      }
                    }}
                    className="aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200"
                    style={{
                      background: style ? style.bg : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        isSelected
                          ? "rgba(139,92,246,0.9)"
                          : style
                            ? style.border
                            : isToday
                              ? "rgba(139,92,246,0.4)"
                              : "rgba(255,255,255,0.06)"
                      }`,
                      cursor: log ? "pointer" : "default",
                      transform: isSelected ? "scale(1.1)" : "scale(1)",
                      boxShadow: isSelected
                        ? "0 0 15px rgba(139,92,246,0.4)"
                        : "none",
                    }}
                  >
                    <span
                      className={`text-xs font-bold ${
                        isToday ? "text-purple-300" : "text-white"
                      }`}
                    >
                      {day}
                    </span>
                    {log && (
                      <span
                        className="text-xs font-black"
                        style={{ color: style.color }}
                      >
                        {log.sleepScore}
                      </span>
                    )}
                    {isToday && (
                      <div className="w-1 h-1 bg-purple-400 rounded-full mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Day Detail */}
        {selectedLog && (
          <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-lg">
                📋 {dayjs(selectedLog.date).format("dddd, MMMM D YYYY")}
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-purple-400 hover:text-white transition text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Sleep Score",
                  value: selectedLog.sleepScore,
                  color: getScoreStyle(selectedLog.sleepScore).color,
                },
                {
                  label: "Duration",
                  value: `${selectedLog.duration}h`,
                  color: "#a78bfa",
                },
                {
                  label: "Bed Time",
                  value: selectedLog.bedTime,
                  color: "#a78bfa",
                },
                {
                  label: "Wake Time",
                  value: selectedLog.wakeTime,
                  color: "#a78bfa",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass rounded-xl p-4 text-center"
                >
                  <p className="text-purple-400 text-xs mb-1">{item.label}</p>
                  <p
                    className="text-2xl font-black"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            {selectedLog.notes && (
              <div className="glass rounded-xl p-4 mt-4">
                <p className="text-purple-400 text-xs mb-1">Notes</p>
                <p className="text-sm italic text-purple-200">
                  "{selectedLog.notes}"
                </p>
              </div>
            )}
            <div className="mt-3 text-center">
              <span
                className="glass px-4 py-1 rounded-full text-xs font-bold"
                style={{ color: getScoreStyle(selectedLog.sleepScore).color }}
              >
                {getScoreStyle(selectedLog.sleepScore).label} Night
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-6 justify-center flex-wrap mt-4">
          {[
            {
              bg: "rgba(16,185,129,0.25)",
              border: "rgba(16,185,129,0.5)",
              label: "Excellent 80+",
              color: "#10b981",
            },
            {
              bg: "rgba(245,158,11,0.25)",
              border: "rgba(245,158,11,0.5)",
              label: "Good 60-79",
              color: "#f59e0b",
            },
            {
              bg: "rgba(239,68,68,0.25)",
              border: "rgba(239,68,68,0.5)",
              label: "Poor below 60",
              color: "#ef4444",
            },
            {
              bg: "rgba(255,255,255,0.03)",
              border: "rgba(255,255,255,0.06)",
              label: "No Data",
              color: "#a78bfa",
            },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md"
                style={{ background: l.bg, border: `1px solid ${l.border}` }}
              />
              <span className="text-xs" style={{ color: l.color }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
