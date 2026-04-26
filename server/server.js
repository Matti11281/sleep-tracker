const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sleepRoutes = require("./routes/sleepRoutes");
const habitRoutes = require("./routes/habitRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sleep-tracker-two-kappa.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Sleep Tracker API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
