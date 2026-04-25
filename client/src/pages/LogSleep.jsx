import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const LogSleep = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [bedTime, setBedTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !bedTime || !wakeTime || !quality) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      date: date,
      bedTime: bedTime,
      wakeTime: wakeTime,
      quality: Number(quality),
      notes: notes,
    };

    console.log("Sending payload:", payload);

    setLoading(true);
    try {
      const response = await API.post("/sleep", payload);
      console.log("Response:", response.data);
      toast.success("Sleep logged! 🌙");
      navigate("/dashboard");
    } catch (error) {
      console.log("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const qualityLabels = [
    "",
    "😫 Terrible",
    "😞 Poor",
    "😐 Okay",
    "😊 Good",
    "🌟 Amazing",
  ];

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "radial-gradient(ellipse at top,#1a0a3c 0%,#050510 60%)",
      }}
    >
      <div
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full pointer-events-none"
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

      <div className="px-8 py-10 flex justify-center">
        <div className="w-full max-w-lg animate-fadeInUp">
          <div className="mb-8">
            <p className="text-purple-400 text-sm font-medium mb-1">
              How did you sleep?
            </p>
            <h2 className="text-4xl font-black">Log Sleep</h2>
            <p className="text-purple-300 mt-1">
              Track last night for better insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Date */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field w-full px-4 py-3 rounded-xl text-sm mt-2"
                required
              />
            </div>

            {/* Bed Time and Wake Time */}
            <div className="glass rounded-2xl p-5 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                  🛏 Bed Time
                </label>
                <input
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-xl text-sm mt-2"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                  ☀️ Wake Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-xl text-sm mt-2"
                  required
                />
              </div>
            </div>

            {/* Quality */}
            <div className="glass rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                  Sleep Quality
                </label>
                <span className="text-sm font-medium">
                  {qualityLabels[quality]}
                </span>
              </div>
              <div className="flex gap-3 justify-between">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setQuality(n)}
                    className={`flex-1 py-3 rounded-xl text-lg transition-all duration-300 ${
                      quality === n
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 scale-110 shadow-lg shadow-purple-900"
                        : "glass hover:scale-105"
                    }`}
                  >
                    {["😫", "😞", "😐", "😊", "🌟"][n - 1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel? Any dreams?"
                className="input-field w-full px-4 py-3 rounded-xl text-sm mt-2 h-24 resize-none"
              />
            </div>

            {/* Submit */}
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
                "Save Sleep Log 😴"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogSleep;
