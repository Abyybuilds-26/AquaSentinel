const express = require('express');
const router = express.Router();
const store = require('../db/store');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/analytics/daily
 * Returns 7-day daily usage array.
 */
router.get('/daily', authMiddleware, (req, res) => {
  const data = store.getDailyUsage();
  const total = data.reduce((sum, d) => sum + d.usage, 0);
  const avg = Math.round(total / data.length);
  const highest = Math.max(...data.map((d) => d.usage));
  const lowest = Math.min(...data.map((d) => d.usage));

  res.json({
    data,
    stats: { total, avg, highest, lowest },
  });
});

/**
 * GET /api/analytics/hourly
 * Returns today's hourly usage data.
 */
router.get('/hourly', authMiddleware, (req, res) => {
  const data = store.getHourlyUsage();
  res.json({ data });
});

/**
 * GET /api/analytics/resident
 * Returns resident personal usage stats.
 */
router.get('/resident', authMiddleware, (req, res) => {
  const data = store.getResidentUsage();
  res.json({ data });
});

module.exports = router;
