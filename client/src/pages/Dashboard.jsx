import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import StreakCard from "../components/dashboard/StreakCard";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(15,10,40,0.95)",
          border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: "12px",
          padding: "10px 14px",
          fontSize: "12px",
        }}
      >
        <p style={{ color: "#a78bfa", marginBottom: "4px" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: "bold" }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const navItems = [
  { path: "/log", icon: "➕", label: "Log Sleep", color: "#7c3aed" },
  { path: "/history", icon: "📅", label: "History", color: "#4f46e5" },
  { path: "/calendar", icon: "🗓️", label: "Calendar", color: "#0ea5e9" },
  { path: "/ai-coach", icon: "🤖", label: "AI Coach", color: "#8b5cf6" },
  { path: "/habits", icon: "🌙", label: "Habits", color: "#6366f1" },
  { path: "/correlation", icon: "📊", label: "Correlation", color: "#a855f7" },
  { path: "/winddown", icon: "✨", label: "Wind Down", color: "#ec4899" },
  { path: "/sleepdebt", icon: "😴", label: "Sleep Debt", color: "#f59e0b" },
  { path: "/report", icon: "📋", label: "Report Card", color: "#10b981" },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        sidebarOpen &&
        !e.target.closest("#sidebar") &&
        !e.target.closest("#sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sidebarOpen]);

  const fetchData = async () => {
    try {
      const [statsRes, weeklyRes, habitsRes] = await Promise.all([
        API.get("/sleep/stats"),
        API.get("/sleep/weekly"),
        API.get("/habits"),
      ]);
      setStats(statsRes.data);
      setHabits(habitsRes.data);
      const formatted = weeklyRes.data.map((log) => ({
        day: dayjs(log.date).format("ddd"),
        Hours: log.duration,
        Score: log.sleepScore,
      }));
      setWeeklyData(formatted);
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: "Good Morning", emoji: "🌅" };
    if (h < 18) return { text: "Good Afternoon", emoji: "☀️" };
    return { text: "Good Evening", emoji: "🌙" };
  };

  const greeting = getHour();

  const statCards = [
    {
      label: "Avg Duration",
      value: stats ? `${stats.avgDuration}h` : "--",
      icon: "⏱️",
      gradient: "linear-gradient(135deg,#7c3aed,#4f46e5)",
    },
    {
      label: "Avg Score",
      value: stats ? stats.avgScore : "--",
      icon: "⭐",
      gradient: "linear-gradient(135deg,#a855f7,#ec4899)",
    },
    {
      label: "Total Logs",
      value: stats ? stats.totalLogs : "--",
      icon: "📊",
      gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    },
    {
      label: "Best Night",
      value: stats?.bestNight ? `${stats.bestNight.sleepScore}pts` : "--",
      icon: "🏆",
      gradient: "linear-gradient(135deg,#10b981,#0ea5e9)",
    },
  ];

  const todayStr = new Date().toISOString().split("T")[0];
  const todayHabits = habits.find((h) => h.date === todayStr);

  const habitItems = [
    { key: "caffeineAfter2pm", emoji: "☕", label: "Caffeine", bad: true },
    {
      key: "screenTimeBeforeBed",
      emoji: "📱",
      label: "Screen Time",
      bad: true,
    },
    { key: "exercisedToday", emoji: "🏃", label: "Exercise", bad: false },
    { key: "alcoholConsumed", emoji: "🍷", label: "Alcohol", bad: true },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050510",
        color: "white",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "40%",
          height: "40%",
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "280px",
          zIndex: 50,
          background: "rgba(10,5,30,0.97)",
          backdropFilter: "blur(30px)",
          borderLeft: "1px solid rgba(139,92,246,0.15)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          boxShadow: sidebarOpen
            ? "-20px 0 60px rgba(124,58,237,0.15)"
            : "none",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "24px 24px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                😴
              </div>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: "16px",
                  fontFamily: "Syne,sans-serif",
                }}
              >
                SleepAI
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
              }
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "rgba(124,58,237,0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 900,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "13px" }}>
                  {user?.name}
                </p>
                <p style={{ color: "#a78bfa", fontSize: "11px" }}>
                  {stats?.streak || 0} day streak 🔥
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              color: "rgba(167,139,250,0.5)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              padding: "8px 8px 4px",
            }}
          >
            Navigation
          </p>
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                onMouseEnter={() => setHoveredNav(item.path)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: isActive
                    ? `1px solid ${item.color}40`
                    : "1px solid transparent",
                  background: isActive
                    ? `${item.color}18`
                    : hoveredNav === item.path
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  color: "white",
                  transform:
                    hoveredNav === item.path
                      ? "translateX(4px)"
                      : "translateX(0)",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: isActive
                      ? `${item.color}30`
                      : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    border: isActive
                      ? `1px solid ${item.color}40`
                      : "1px solid transparent",
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? item.color : "rgba(255,255,255,0.8)",
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div
                    style={{
                      marginLeft: "auto",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: item.color,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "12px",
              cursor: "pointer",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
            }
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Topbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(5,5,16,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "0 32px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 0 20px rgba(124,58,237,0.3)",
            }}
          >
            😴
          </div>
          <span
            style={{
              fontWeight: 900,
              fontSize: "18px",
              fontFamily: "Syne,sans-serif",
              background: "linear-gradient(135deg,#fff,#a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SleepAI
          </span>
        </div>

        {/* Right Side Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Quick nav buttons */}
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.label}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${item.color}20`;
                e.currentTarget.style.borderColor = `${item.color}40`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {item.icon}
            </button>
          ))}

          <div
            style={{
              width: "1px",
              height: "24px",
              background: "rgba(255,255,255,0.08)",
              margin: "0 4px",
            }}
          />

          {/* Log Sleep Button */}
          <button
            onClick={() => navigate("/log")}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              border: "none",
              color: "white",
              fontWeight: 700,
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 15px rgba(124,58,237,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(124,58,237,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(124,58,237,0.3)";
            }}
          >
            ➕ Log Sleep
          </button>

          {/* Sidebar Toggle */}
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: sidebarOpen
                ? "rgba(124,58,237,0.2)"
                : "rgba(255,255,255,0.04)",
              border: sidebarOpen
                ? "1px solid rgba(124,58,237,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "4px",
              transition: "all 0.2s ease",
              padding: "10px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 1 ? "14px" : "18px",
                  height: "2px",
                  background: "white",
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  transform:
                    sidebarOpen && i === 0
                      ? "rotate(45deg) translate(4px, 4px)"
                      : sidebarOpen && i === 2
                        ? "rotate(-45deg) translate(4px, -4px)"
                        : sidebarOpen && i === 1
                          ? "scaleX(0)"
                          : "none",
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "32px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Hero Header */}
        <div
          style={{
            marginBottom: "32px",
            animation: "fadeInUp 0.6s ease forwards",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: "100px",
                  padding: "4px 12px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                    display: "inline-block",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "#a78bfa",
                    fontWeight: 600,
                  }}
                >
                  {greeting.emoji} {greeting.text}
                </span>
              </div>
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: 900,
                  fontFamily: "Syne,sans-serif",
                  background:
                    "linear-gradient(135deg,#fff 0%,#a78bfa 50%,#818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.1,
                  marginBottom: "8px",
                }}
              >
                {user?.name}
              </h1>
              <p style={{ color: "rgba(167,139,250,0.7)", fontSize: "14px" }}>
                {dayjs().format("dddd, MMMM D YYYY")}
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {statCards.map((s, i) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                animation: `fadeInUp 0.6s ease ${i * 0.1}s forwards`,
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.border = "1px solid rgba(139,92,246,0.3)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(124,58,237,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.07)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: s.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "12px",
                  boxShadow: "0 4px 15px rgba(124,58,237,0.2)",
                }}
              >
                {s.icon}
              </div>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  fontFamily: "Syne,sans-serif",
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  color: "rgba(167,139,250,0.6)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Streak Card */}
        <div style={{ marginBottom: "24px" }}>
          <StreakCard
            streak={stats?.streak || 0}
            userBadges={stats?.badges || []}
          />
        </div>

        {/* Today's Habits */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
            animation: "fadeInUp 0.6s ease 0.4s forwards",
            opacity: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div>
              <h3
                style={{
                  fontWeight: 900,
                  fontSize: "16px",
                  fontFamily: "Syne,sans-serif",
                }}
              >
                Today's Habits
              </h3>
              <p
                style={{
                  color: "rgba(167,139,250,0.6)",
                  fontSize: "11px",
                  marginTop: "2px",
                }}
              >
                {todayHabits ? "Logged today ✅" : "Not logged yet"}
              </p>
            </div>
            <button
              onClick={() => navigate("/habits")}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: "11px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {todayHabits ? "Update" : "+ Log Habits"}
            </button>
          </div>

          {todayHabits ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}
            >
              {habitItems.map((h) => {
                const active = todayHabits[h.key];
                return (
                  <div
                    key={h.key}
                    style={{
                      borderRadius: "14px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: active
                        ? h.bad
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(16,185,129,0.1)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        active
                          ? h.bad
                            ? "rgba(239,68,68,0.25)"
                            : "rgba(16,185,129,0.25)"
                          : "rgba(255,255,255,0.06)"
                      }`,
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{h.emoji}</span>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: 600 }}>
                        {h.label}
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: active
                            ? h.bad
                              ? "#ef4444"
                              : "#10b981"
                            : "rgba(167,139,250,0.5)",
                        }}
                      >
                        {active ? (h.bad ? "⚠️ Yes" : "✅ Yes") : "— No"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px" }}>
              <p style={{ fontSize: "32px", marginBottom: "8px" }}>🌙</p>
              <p style={{ color: "rgba(167,139,250,0.6)", fontSize: "13px" }}>
                Log your habits to track their impact on sleep
              </p>
            </div>
          )}
        </div>

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Sleep Duration Chart */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "20px",
              padding: "24px",
              animation: "fadeInUp 0.6s ease 0.5s forwards",
              opacity: 0,
            }}
          >
            <h3
              style={{
                fontWeight: 900,
                fontSize: "15px",
                fontFamily: "Syne,sans-serif",
                marginBottom: "4px",
              }}
            >
              Sleep Duration
            </h3>
            <p
              style={{
                color: "rgba(167,139,250,0.6)",
                fontSize: "11px",
                marginBottom: "20px",
              }}
            >
              Last 7 nights in hours
            </p>
            {loading ? (
              <div
                style={{
                  height: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "2px solid rgba(124,58,237,0.3)",
                    borderTop: "2px solid #7c3aed",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            ) : weeklyData.length === 0 ? (
              <div
                style={{
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "36px" }}>😴</span>
                <p style={{ color: "rgba(167,139,250,0.6)", fontSize: "12px" }}>
                  Log sleep to see charts
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData} barSize={24}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#a78bfa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a78bfa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(124,58,237,0.08)" }}
                  />
                  <Bar
                    dataKey="Hours"
                    fill="url(#hoursGrad)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop
                        offset="100%"
                        stopColor="#4f46e5"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Sleep Score Chart */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "20px",
              padding: "24px",
              animation: "fadeInUp 0.6s ease 0.6s forwards",
              opacity: 0,
            }}
          >
            <h3
              style={{
                fontWeight: 900,
                fontSize: "15px",
                fontFamily: "Syne,sans-serif",
                marginBottom: "4px",
              }}
            >
              Sleep Score
            </h3>
            <p
              style={{
                color: "rgba(167,139,250,0.6)",
                fontSize: "11px",
                marginBottom: "20px",
              }}
            >
              Quality trend this week
            </p>
            {loading ? (
              <div
                style={{
                  height: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "2px solid rgba(124,58,237,0.3)",
                    borderTop: "2px solid #7c3aed",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            ) : weeklyData.length === 0 ? (
              <div
                style={{
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "36px" }}>📈</span>
                <p style={{ color: "rgba(167,139,250,0.6)", fontSize: "12px" }}>
                  Log sleep to see trends
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#a78bfa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a78bfa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="Score"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{
                      fill: "#7c3aed",
                      r: 5,
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8, fill: "#7c3aed" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ marginBottom: "8px" }}>
          <h3
            style={{
              fontWeight: 900,
              fontSize: "15px",
              fontFamily: "Syne,sans-serif",
              color: "rgba(167,139,250,0.7)",
              marginBottom: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontSize: "11px",
            }}
          >
            Quick Actions
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
            }}
          >
            {navItems.map((item, i) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: "16px 12px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "white",
                  textAlign: "center",
                  transition: "all 0.25s ease",
                  animation: `fadeInUp 0.6s ease ${0.7 + i * 0.05}s forwards`,
                  opacity: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.background = `${item.color}12`;
                  e.currentTarget.style.borderColor = `${item.color}35`;
                  e.currentTarget.style.boxShadow = `0 12px 30px ${item.color}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
