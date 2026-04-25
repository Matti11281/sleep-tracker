import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const ReportCard = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    setReport(null);
    try {
      const { data } = await API.get("/ai/report-card");
      setReport(data);
      toast.success("Report generated! 📊");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const getGPAColor = (gpa) => {
    if (gpa.startsWith("A")) return "#10b981";
    if (gpa.startsWith("B")) return "#a78bfa";
    if (gpa.startsWith("C")) return "#f59e0b";
    if (gpa.startsWith("D")) return "#f97316";
    return "#ef4444";
  };

  const getImprovementText = (improvement) => {
    if (improvement === null) return null;
    if (improvement > 0)
      return {
        text: `+${improvement} pts vs last week`,
        color: "#10b981",
        icon: "📈",
      };
    if (improvement < 0)
      return {
        text: `${improvement} pts vs last week`,
        color: "#ef4444",
        icon: "📉",
      };
    return { text: "Same as last week", color: "#a78bfa", icon: "➡️" };
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

      {/* Navbar */}
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

      <div className="px-8 py-10 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 animate-fadeInUp">
            <p className="text-purple-400 text-sm font-medium mb-1">
              AI Powered
            </p>
            <h2 className="text-4xl font-black">Weekly Report Card</h2>
            <p className="text-purple-300 mt-1">
              Your personalized sleep intelligence report
            </p>
          </div>

          {/* Generate Button */}
          {!report && !loading && (
            <div className="glass rounded-2xl p-8 text-center animate-fadeInUp mb-6">
              <div className="text-6xl mb-4 animate-float">📊</div>
              <h3 className="text-2xl font-black mb-2">Generate Your Report</h3>
              <p className="text-purple-300 text-sm mb-6 max-w-md mx-auto">
                Our AI analyzes all your sleep data, habits, and patterns to
                create a fully personalized weekly report card
              </p>
              <button
                onClick={generateReport}
                className="btn-primary px-8 py-4 rounded-xl font-bold text-sm animate-pulse-glow"
              >
                ✨ Generate My Report Card
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="glass rounded-2xl p-12 text-center animate-fadeInUp">
              <div className="text-5xl mb-4 animate-float">🤖</div>
              <p className="font-black text-lg mb-2">
                AI is analyzing your sleep...
              </p>
              <p className="text-purple-400 text-sm mb-6">
                Crunching your data and generating insights
              </p>
              <div className="flex justify-center gap-2">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Report Card */}
          {report && !loading && (
            <div className="flex flex-col gap-5 animate-fadeInUp">
              {/* GPA Card */}
              <div
                className="glass rounded-2xl p-8 text-center"
                style={{
                  background: `rgba(${report.gpa.startsWith("A") ? "16,185,129" : report.gpa.startsWith("B") ? "124,58,237" : "245,158,11"},0.1)`,
                  border: `1px solid rgba(${report.gpa.startsWith("A") ? "16,185,129" : report.gpa.startsWith("B") ? "124,58,237" : "245,158,11"},0.3)`,
                }}
              >
                <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">
                  Weekly Sleep GPA
                </p>
                <p
                  className="text-9xl font-black mb-2"
                  style={{ color: getGPAColor(report.gpa) }}
                >
                  {report.gpa}
                </p>
                <p className="text-2xl font-black text-white mb-1">
                  {report.score}/100
                </p>
                {getImprovementText(report.improvement) && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span>{getImprovementText(report.improvement).icon}</span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: getImprovementText(report.improvement).color,
                      }}
                    >
                      {getImprovementText(report.improvement).text}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Sleep Personality",
                    value: report.personality,
                    icon: "🧬",
                  },
                  {
                    label: "Avg Duration",
                    value: `${report.avgDuration}h`,
                    icon: "⏱️",
                  },
                  {
                    label: "Current Streak",
                    value: `${report.streak} days 🔥`,
                    icon: "📅",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="glass rounded-2xl p-4 text-center"
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <p className="text-sm font-black mt-2">{s.value}</p>
                    <p className="text-purple-400 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* What You Did Well */}
              <div
                className="glass rounded-2xl p-6"
                style={{ border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <span>🌟</span> What You Did Well
                </h3>
                <div className="flex flex-col gap-2">
                  {report.whatYouDidWell?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(16,185,129,0.08)" }}
                    >
                      <span className="text-emerald-400 font-black text-sm mt-0.5">
                        ✓
                      </span>
                      <p className="text-sm text-purple-100">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Insights */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <span>🔍</span> Personal Insights
                </h3>
                <div className="flex flex-col gap-3">
                  {report.insights?.map((insight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(124,58,237,0.1)" }}
                    >
                      <span className="text-purple-400 font-black text-sm mt-0.5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-purple-100">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biggest Sleep Killer */}
              <div
                className="glass rounded-2xl p-6"
                style={{ border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                  <span>⚠️</span> Biggest Sleep Killer
                </h3>
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.08)" }}
                >
                  <p className="text-sm text-purple-100">
                    {report.biggestSleepKiller}
                  </p>
                </div>
              </div>

              {/* Prescription */}
              <div
                className="glass rounded-2xl p-6"
                style={{ border: "1px solid rgba(167,139,250,0.2)" }}
              >
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <span>💊</span> Your Sleep Prescription
                </h3>
                <div className="flex flex-col gap-3">
                  {report.prescription?.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(167,139,250,0.08)" }}
                    >
                      <div className="w-6 h-6 rounded-lg btn-primary flex items-center justify-center text-xs font-black flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-purple-100">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Week Goals */}
              <div
                className="glass rounded-2xl p-6"
                style={{ border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <span>🎯</span> Next Week Goals
                </h3>
                <div className="flex flex-col gap-3">
                  {report.nextWeekGoals?.map((goal, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(245,158,11,0.08)" }}
                    >
                      <span className="text-yellow-400 text-lg flex-shrink-0">
                        🎯
                      </span>
                      <p className="text-sm text-purple-100">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regenerate Button */}
              <button
                onClick={generateReport}
                className="btn-outline py-4 rounded-2xl font-bold text-sm"
              >
                🔄 Regenerate Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
