const express = require("express");
const router = express.Router();
const {
  analyzeSleep,
  generateRoutine,
  chatWithAI,
  generateReportCard,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/analyze", protect, analyzeSleep);
router.post("/routine", protect, generateRoutine);
router.post("/chat", protect, chatWithAI);
router.get("/report-card", protect, generateReportCard);

module.exports = router;
