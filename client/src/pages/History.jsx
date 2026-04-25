import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const History = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/sleep");
      setLogs(data);
    } catch {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id) => {
    try {
      await API.delete(`/sleep/${id}`);
      toast.success("Log deleted");
      fetchLogs();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent 🌟";
    if (score >= 60) return "Good 👍";
    return "Poor 😴";
  };

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
        <div className="animate-fadeInUp mb-8 flex justify-between items-end">
          <div>
            <p className="text-purple-400 text-sm font-medium mb-1">
              Your journey
            </p>
            <h2 className="text-4xl font-black">Sleep History</h2>
            <p className="text-purple-300 mt-1">{logs.length} nights logged</p>
          </div>
          <button
            onClick={() => navigate("/log")}
            className="btn-primary px-5 py-3 rounded-xl text-sm font-bold"
          >
            + Log Tonight
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-purple-300">Loading your sleep data...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center animate-fadeInUp">
            <div className="text-7xl mb-4 animate-float">😴</div>
            <h3 className="text-2xl font-black mb-2">No logs yet</h3>
            <p className="text-purple-300 mb-6">
              Start tracking tonight for better insights
            </p>
            <button
              onClick={() => navigate("/log")}
              className="btn-primary px-6 py-3 rounded-xl font-bold"
            >
              Log First Sleep
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {logs.map((log, i) => (
              <div
                key={log._id}
                className="glass glass-hover rounded-2xl p-6 flex justify-between items-center animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getScoreColor(log.sleepScore)} flex items-center justify-center`}
                  >
                    <span className="text-xl font-black">{log.sleepScore}</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {new Date(log.date).toDateString()}
                    </p>
                    <p className="text-purple-300 text-sm">
                      🛏 {log.bedTime} → ☀️ {log.wakeTime} &nbsp;•&nbsp; ⏱{" "}
                      {log.duration}hrs
                    </p>
                    <p className="text-purple-300 text-sm">
                      {"⭐".repeat(log.quality)} &nbsp;•&nbsp;{" "}
                      {getScoreLabel(log.sleepScore)}
                    </p>
                    {log.notes && (
                      <p className="text-purple-400 text-xs mt-1 italic">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteLog(log._id)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-red-400 border border-red-400 border-opacity-30 hover:bg-red-400 hover:bg-opacity-10 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
