import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const Habits = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    caffeineAfter2pm: false,
    screenTimeBeforeBed: false,
    exercisedToday: false,
    alcoholConsumed: false,
    stressLevel: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/habits", form);
      console.log("Habit saved:", response.data);
      toast.success("Habits saved! 🌙");
      navigate("/dashboard");
    } catch (error) {
      console.log("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const habits = [
    {
      field: "caffeineAfter2pm",
      emoji: "☕",
      label: "Caffeine after 2pm",
      bad: true,
    },
    {
      field: "screenTimeBeforeBed",
      emoji: "📱",
      label: "Screen time before bed",
      bad: true,
    },
    {
      field: "exercisedToday",
      emoji: "🏃",
      label: "Exercised today",
      bad: false,
    },
    {
      field: "alcoholConsumed",
      emoji: "🍷",
      label: "Alcohol consumed",
      bad: true,
    },
  ];

  const stressEmojis = ["😌", "🙂", "😐", "😟", "😰"];

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "radial-gradient(ellipse at top,#1a0a3c 0%,#050510 60%)",
      }}
    >
      <nav className="glass border-b border-white border-opacity-5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 btn-primary rounded-xl flex items-center justify-center text-lg">
            🌙
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

      <div className="px-8 py-10 flex justify-center">
        <div className="w-full max-w-lg animate-fadeInUp">
          <div className="mb-8">
            <p className="text-purple-400 text-sm font-medium mb-1">
              Daily check-in
            </p>
            <h2 className="text-4xl font-black">Log Habits</h2>
            <p className="text-purple-300 mt-1">
              Track what affects your sleep quality
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="glass rounded-2xl p-5">
              <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field w-full px-4 py-3 rounded-xl text-sm mt-2"
                required
              />
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-3">
                Today's Habits
              </p>
              <div className="flex flex-col gap-3">
                {habits.map((h) => (
                  <div
                    key={h.field}
                    onClick={() =>
                      setForm({ ...form, [h.field]: !form[h.field] })
                    }
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300"
                    style={{
                      background: form[h.field]
                        ? h.bad
                          ? "rgba(239,68,68,0.2)"
                          : "rgba(16,185,129,0.2)"
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${
                        form[h.field]
                          ? h.bad
                            ? "rgba(239,68,68,0.4)"
                            : "rgba(16,185,129,0.4)"
                          : "rgba(255,255,255,0.1)"
                      }`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{h.emoji}</span>
                      <div>
                        <p className="text-sm font-medium">{h.label}</p>
                        <p className="text-xs text-purple-400">
                          {h.bad ? "⚠️ Hurts sleep" : "✅ Helps sleep"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        form[h.field]
                          ? "bg-white"
                          : "border border-white border-opacity-20"
                      }`}
                    >
                      {form[h.field] && (
                        <span className="text-purple-900 text-sm font-black">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                  Stress Level
                </p>
                <span className="text-2xl">
                  {stressEmojis[form.stressLevel - 1]}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={form.stressLevel}
                onChange={(e) =>
                  setForm({ ...form, stressLevel: Number(e.target.value) })
                }
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-purple-400 mt-2">
                <span>😌 Very Low</span>
                <span>😐 Medium</span>
                <span>😰 Very High</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-4 rounded-2xl font-bold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Habits 🌙"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Habits;
