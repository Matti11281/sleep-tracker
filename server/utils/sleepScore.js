const calculateSleepScore = (duration, quality, goalHours = 8) => {
  const durationScore = Math.min((duration / goalHours) * 50, 50);
  const qualityScore = (quality / 5) * 50;
  return Math.round(durationScore + qualityScore);
};

module.exports = calculateSleepScore;
