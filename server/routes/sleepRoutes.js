const express = require("express");
const router = express.Router();
const {
  addSleepLog,
  getSleepLogs,
  getWeeklySleep,
  getSleepStats,
  updateSleepLog,
  deleteSleepLog,
} = require("../controllers/sleepController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addSleepLog);
router.get("/", protect, getSleepLogs);
router.get("/weekly", protect, getWeeklySleep);
router.get("/stats", protect, getSleepStats);
router.put("/:id", protect, updateSleepLog);
router.delete("/:id", protect, deleteSleepLog);

module.exports = router;
