const allBadges = {
  "3-day-streak": { icon: "🔥", label: "3 Day Streak" },
  "week-warrior": { icon: "⚔️", label: "Week Warrior" },
  "sleep-master": { icon: "👑", label: "Sleep Master" },
  "perfect-sleep": { icon: "💎", label: "Perfect Sleep" },
  "goal-crusher": { icon: "🎯", label: "Goal Crusher" },
};

const StreakCard = ({ streak = 0, userBadges = [] }) => {
  return (
    <div className="glass rounded-2xl p-6 animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-purple-400 uppercase tracking-wider font-medium">
            Current Streak
          </p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-5xl font-black">{streak}</span>
            <span className="text-2xl mb-1">🔥</span>
          </div>
          <p className="text-purple-300 text-sm mt-1">
            {streak === 0 && "Log sleep tonight to start!"}
            {streak === 1 && "Great start! Keep going!"}
            {streak >= 2 && streak < 7 && `${7 - streak} days to Week Warrior!`}
            {streak >= 7 &&
              streak < 30 &&
              `${30 - streak} days to Sleep Master!`}
            {streak >= 30 && "You are a Sleep Master! 👑"}
          </p>
        </div>

        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#streakGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${Math.min((streak / 30) * 251, 251)} 251`}
            />
            <defs>
              <linearGradient id="streakGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black">{streak}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-purple-400 uppercase tracking-wider font-medium mb-3">
          Badges Earned
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(allBadges).map(([key, badge]) => {
            const earned = userBadges.includes(key);
            return (
              <div
                key={key}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                  earned
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-purple-900"
                    : "glass opacity-30"
                }`}
              >
                <span>{badge.icon}</span>
                <span className="font-medium">{badge.label}</span>
                {!earned && <span>🔒</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
