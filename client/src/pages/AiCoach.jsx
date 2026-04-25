import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const AiCoach = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey! I'm your AI Sleep Coach 🤖\n\nI can analyze your sleep patterns and give you personalized tips. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await API.post("/ai/chat", { message: msg });
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      toast.error("AI unavailable");
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { icon: "😴", text: "Why am I always tired?" },
    { icon: "⚡", text: "How to sleep faster?" },
    { icon: "📅", text: "Best sleep schedule?" },
    { icon: "🌙", text: "Make me a routine" },
    { icon: "☕", text: "Does caffeine affect sleep?" },
    { icon: "📱", text: "Screen time before bed?" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col relative"
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

      <nav className="glass border-b border-white border-opacity-5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 btn-primary rounded-xl flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <span className="text-lg font-black">AI Sleep Coach</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-outline px-4 py-2 rounded-xl text-xs font-medium"
        >
          ← Dashboard
        </button>
      </nav>

      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          {quickPrompts.map((p) => (
            <button
              key={p.text}
              onClick={() => sendMessage(p.text)}
              className="glass glass-hover px-4 py-2 rounded-full text-xs flex items-center gap-2 transition"
            >
              <span>{p.icon}</span> {p.text}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-fadeInUp ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 btn-primary rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-lg px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 rounded-tr-none"
                    : "glass rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 glass rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-1">
                  👤
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start animate-fadeInUp">
              <div className="w-8 h-8 btn-primary rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                🤖
              </div>
              <div className="glass px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
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
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="glass border-t border-white border-opacity-5 px-8 py-4">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything about sleep..."
            className="input-field flex-1 px-5 py-3 rounded-xl text-sm"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="btn-primary px-6 py-3 rounded-xl font-bold text-sm"
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCoach;
