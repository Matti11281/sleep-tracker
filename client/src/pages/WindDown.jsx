import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const WindDown = () => {
  const navigate = useNavigate();
  const [bedTime, setBedTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState(null);
  const [checked, setChecked] = useState({});

  const generateRoutine = async () => {
    setLoading(true);
    setRoutine(null);
    setChecked({});
    try {
      const { data } = await API.post("/ai/routine", { bedTime, wakeTime });
      const lines = data.routine
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0);
      setRoutine(lines);
      toast.success("Routine generated! 🌙");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate routine");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (i) => {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = routine ? routine.length : 0;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getStepIcon = (i) => {
    const icons = ["🧘", "📵", "🛁", "📖", "🌡️", "🍵", "💡", "🎵", "✍️", "🌬️"];
    return icons[i % icons.length];
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
            "radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)",
        }}
      />

      {/* Navbar */}
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
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-8 animate-fadeInUp">
            <p className="text-purple-400 text-sm font-medium mb-1">
              AI Powered
            </p>
            <h2 className="text-4xl font-black">Wind Down Routine</h2>
            <p className="text-purple-300 mt-1">
              Get a personalized bedtime routine to sleep faster
            </p>
          </div>

          {/* Time Input Card */}
          <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
            <p className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-4">
              Your Sleep Schedule
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                  🛏 Bed Time
                </label>
                <input
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-xl text-sm mt-2"
                />
              </div>
              <div>
                <label className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                  ☀️ Wake Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-xl text-sm mt-2"
                />
              </div>
            </div>

            <button
              onClick={generateRoutine}
              disabled={loading}
              className="btn-primary w-full py-4 rounded-xl font-bold text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI is building your routine...
                </span>
              ) : routine ? (
                "🔄 Regenerate Routine"
              ) : (
                "✨ Generate My Routine"
              )}
            </button>
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="glass rounded-2xl p-8 text-center animate-fadeInUp mb-6">
              <div className="text-5xl mb-4 animate-float">🤖</div>
              <p className="text-purple-300 font-medium">
                AI is creating your personalized routine...
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <span
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          )}

          {/* Routine Steps */}
          {routine && !loading && (
            <div className="animate-fadeInUp">
              {/* Progress Bar */}
              <div className="glass rounded-2xl p-5 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold">Tonight's Progress</p>
                  <p className="text-sm font-black text-purple-300">
                    {completedCount}/{totalCount} steps
                  </p>
                </div>
                <div className="w-full bg-white bg-opacity-10 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                    }}
                  />
                </div>
                <p className="text-xs text-purple-400 mt-2 text-right">
                  {progress}% complete
                </p>
              </div>

              {/* Completion Message */}
              {progress === 100 && (
                <div
                  className="glass rounded-2xl p-5 mb-4 text-center"
                  style={{ border: "1px solid rgba(16,185,129,0.4)" }}
                >
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-black text-emerald-400">
                    Routine Complete!
                  </p>
                  <p className="text-purple-300 text-sm mt-1">
                    You're ready for a great sleep!
                  </p>
                </div>
              )}

              {/* Steps List */}
              <div className="glass rounded-2xl p-6">
                <p className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-4">
                  Your Personalized Steps
                </p>
                <div className="flex flex-col gap-3">
                  {routine.map((step, i) => (
                    <div
                      key={i}
                      onClick={() => toggleCheck(i)}
                      className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300"
                      style={{
                        background: checked[i]
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${
                          checked[i]
                            ? "rgba(16,185,129,0.3)"
                            : "rgba(255,255,255,0.08)"
                        }`,
                        opacity: checked[i] ? 0.7 : 1,
                      }}
                    >
                      {/* Step Number */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                        style={{
                          background: checked[i]
                            ? "rgba(16,185,129,0.3)"
                            : "rgba(124,58,237,0.3)",
                        }}
                      >
                        {checked[i] ? "✓" : i + 1}
                      </div>

                      {/* Step Icon + Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getStepIcon(i)}</span>
                          <p
                            className={`text-sm font-medium leading-relaxed ${
                              checked[i]
                                ? "line-through text-purple-400"
                                : "text-white"
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{
                          background: checked[i]
                            ? "rgba(16,185,129,0.5)"
                            : "rgba(255,255,255,0.05)",
                          border: `1px solid ${
                            checked[i]
                              ? "rgba(16,185,129,0.8)"
                              : "rgba(255,255,255,0.15)"
                          }`,
                        }}
                      >
                        {checked[i] && (
                          <span className="text-white text-xs font-black">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => setChecked({})}
                className="btn-outline w-full py-3 rounded-xl text-sm font-medium mt-4"
              >
                🔄 Reset Checklist
              </button>
            </div>
          )}

          {/* Tips Card — shown before routine is generated */}
          {!routine && !loading && (
            <div className="glass rounded-2xl p-6 animate-fadeInUp">
              <p className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-4">
                Why Wind Down?
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: "🧠", text: "Signals your brain it's time to sleep" },
                  { icon: "💆", text: "Reduces stress and anxiety before bed" },
                  { icon: "⏰", text: "Helps you fall asleep 2x faster" },
                  { icon: "😴", text: "Improves overall sleep quality" },
                  { icon: "☀️", text: "Makes waking up easier and refreshing" },
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <span className="text-xl">{tip.icon}</span>
                    <p className="text-sm text-purple-200">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindDown;
