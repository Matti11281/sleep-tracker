import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-4 py-3 rounded-xl text-sm">
        <p className="text-purple-300 font-bold mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value} pts
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Correlation = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCorrelation();
  }, []);

  const fetchCorrelation = async () => {
    try {
      const { data: res } = await API.get("/habits/correlation");
      if (res.message) {
        setMessage(res.message);
      } else {
        setData(res.correlation);
      }
    } catch (error) {
      console.log(error);
      setMessage("Not enough data yet");
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (diff, good) => {
    if (good) return diff > 0 ? "#10b981" : "#ef4444";
    return diff < 0 ? "#10b981" : "#ef4444";
  };

  const getImpactLabel = (diff, good) => {
    if (diff === 0) return "😐 No impact";
    if (good) return diff > 0 ? "✅ Helps sleep" : "⚠️ Hurts sleep";
    return diff < 0 ? "✅ Less is better" : "⚠️ Hurts sleep";
  };

  const chartData = data.map((d) => ({
    name: d.habit.length > 12 ? d.habit.substring(0, 12) + "..." : d.habit,
    "With Habit": d.withHabit,
    "Without Habit": d.withoutHabit,
  }));

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "radial-gradient(ellipse at top,#1a0a3c 0%,#050510 60%)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)",
        }}
      />

      <nav className="glass border-b border-white border-opacity-5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 btn-primary rounded-xl flex items-center justify-center text-lg">
            📊
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
        <div className="mb-8 animate-fadeInUp">
          <p className="text-purple-400 text-sm font-medium mb-1">
            Data Science
          </p>
          <h2 className="text-4xl font-black">Habit Correlation</h2>
          <p className="text-purple-300 mt-1">
            See exactly how your habits affect your sleep score
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : message ? (
          <div className="glass rounded-3xl p-16 text-center animate-fadeInUp">
            <div className="text-7xl mb-4 animate-float">📊</div>
            <h3 className="text-2xl font-black mb-2">Not Enough Data Yet</h3>
            <p className="text-purple-300 mb-6">
              Log both sleep and habits for a few days to see correlations
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/log")}
                className="btn-primary px-6 py-3 rounded-xl font-bold text-sm"
              >
                Log Sleep
              </button>
              <button
                onClick={() => navigate("/habits")}
                className="btn-outline px-6 py-3 rounded-xl font-bold text-sm"
              >
                Log Habits
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
              <h3 className="font-black text-lg mb-1">
                Sleep Score Comparison
              </h3>
              <p className="text-purple-400 text-xs mb-6">
                Average sleep score on days with vs without each habit
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barSize={22}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#a78bfa", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a78bfa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(139,92,246,0.1)" }}
                  />
                  <Legend wrapperStyle={{ color: "#a78bfa", fontSize: 12 }} />
                  <Bar
                    dataKey="With Habit"
                    fill="#7c3aed"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="Without Habit"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((d, i) => (
                <div
                  key={d.key}
                  className="glass glass-hover rounded-2xl p-6 animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-base">{d.habit}</h4>
                      <p className="text-purple-400 text-xs mt-1">
                        {d.dataPoints} nights of data
                      </p>
                    </div>
                    <span
                      className="text-lg font-black"
                      style={{ color: getImpactColor(d.diff, d.good) }}
                    >
                      {d.impact}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <div className="flex-1 glass rounded-xl p-3 text-center">
                      <p className="text-xs text-purple-400 mb-1">With</p>
                      <p className="text-xl font-black text-violet-400">
                        {d.withHabit}
                      </p>
                    </div>
                    <div className="flex items-center text-purple-400 text-xs">
                      vs
                    </div>
                    <div className="flex-1 glass rounded-xl p-3 text-center">
                      <p className="text-xs text-purple-400 mb-1">Without</p>
                      <p className="text-xl font-black text-indigo-400">
                        {d.withoutHabit}
                      </p>
                    </div>
                  </div>

                  <div className="glass rounded-xl px-4 py-2 text-center">
                    <p
                      className="text-sm font-bold"
                      style={{ color: getImpactColor(d.diff, d.good) }}
                    >
                      {getImpactLabel(d.diff, d.good)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Correlation;
