const express = require("express");
const router = express.Router();
const { addHabit, getHabits } = require("../controllers/habitController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addHabit);
router.get("/", protect, getHabits);

module.exports = router;
