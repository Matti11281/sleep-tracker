import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const starsRef = useRef(null);

  useEffect(() => {
    if (!starsRef.current) return;
    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 3 + 1;
      star.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 3 + 2}s;
        animation-delay: ${Math.random() * 3}s;
        opacity: ${Math.random() * 0.7 + 0.1};
      `;
      starsRef.current.appendChild(star);
    }
  }, []);

  const features = [
    {
      icon: "📊",
      title: "Smart Tracking",
      desc: "Log every night and watch your patterns unfold with beautiful charts.",
    },
    {
      icon: "🤖",
      title: "AI Coach",
      desc: "Your personal sleep scientist available 24/7 with tailored advice.",
    },
    {
      icon: "🌙",
      title: "Wind Down",
      desc: "AI-crafted bedtime routines built around your unique schedule.",
    },
    {
      icon: "📈",
      title: "Sleep Score",
      desc: "A single score that tells the whole story of your rest quality.",
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a3c 0%, #050510 60%)",
      }}
    >
      <div ref={starsRef} className="absolute inset-0 pointer-events-none" />

      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)",
        }}
      />

      <nav className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center text-xl">
            😴
          </div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            SleepAI
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="btn-outline px-5 py-2 rounded-xl text-sm font-medium"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn-primary px-5 py-2 rounded-xl text-sm font-medium"
          >
            Get Started
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-purple-300 mb-8 animate-fadeInUp">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI-Powered Sleep Intelligence
        </div>

        <h2
          className="text-7xl font-black mb-6 leading-tight animate-fadeInUp"
          style={{
            animationDelay: "0.1s",
            opacity: 0,
            background:
              "linear-gradient(135deg,#fff 0%,#a78bfa 50%,#818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sleep Smarter.
          <br />
          Live Better.
        </h2>

        <p
          className="text-xl text-purple-200 mb-10 max-w-lg animate-fadeInUp"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          Track your sleep, decode your patterns, and unlock personalized AI
          coaching that transforms how you rest.
        </p>

        <div
          className="flex gap-4 animate-fadeInUp"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <button
            onClick={() => navigate("/register")}
            className="btn-primary px-8 py-4 rounded-2xl text-lg font-bold animate-pulse-glow"
          >
            Start Free Tonight 🚀
          </button>
          <button
            onClick={() => navigate("/login")}
            className="btn-outline px-8 py-4 rounded-2xl text-lg font-medium"
          >
            Sign In
          </button>
        </div>

        <div
          className="flex gap-8 mt-12 text-center animate-fadeInUp"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          {[
            ["10k+", "Users"],
            ["4.9★", "Rating"],
            ["Free", "Forever"],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-purple-300">{val}</p>
              <p className="text-sm text-purple-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 px-8 pb-24">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="glass glass-hover rounded-2xl p-6 cursor-pointer animate-fadeInUp"
            style={{ animationDelay: `${0.5 + i * 0.1}s`, opacity: 0 }}
          >
            <div
              className="text-4xl mb-4 animate-float"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              {f.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-purple-300 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
