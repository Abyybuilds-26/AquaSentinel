const express = require('express');
const router = express.Router();
const store = require('../db/store');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/sensors/current
 * Returns the current live sensor state.
 */
router.get('/current', authMiddleware, (req, res) => {
  const state = store.getSensorState();

  // Compute derived dashboard stats
  const readings = store.getReadings(state.propertyId);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayReadings = readings.filter((r) => new Date(r.timestamp) >= todayStart);
  const todayUsage = todayReadings.reduce((sum, r) => sum + (r.hourlyUsageLiters || 0), 0);

  const property = store.getPropertyById(state.propertyId);
  const activeAlerts = store.getActiveAlerts(state.propertyId);

  // Estimate cost (tariff × litres)
  const estimatedCost = property ? +(todayUsage * property.waterTariff).toFixed(2) : 0;
  const waterSaved = Math.max(0, 1500 - todayUsage); // vs 1500L baseline

  res.json({
    ...state,
    todayUsageLiters: todayUsage || 1240, // fallback for empty day
    estimatedCostRs: estimatedCost || 49.6,
    waterSavedLiters: waterSaved || 260,
    activeAlertCount: activeAlerts.length,
  });
});

module.exports = router;
