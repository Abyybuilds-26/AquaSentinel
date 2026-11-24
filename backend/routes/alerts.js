const express = require('express');
const router = express.Router();
const store = require('../db/store');
const { authMiddleware } = require('../middleware/auth');
const simulator = require('../services/simulatorEngine');

/**
 * GET /api/alerts
 * Returns all alerts (or filtered by propertyId query param).
 */
router.get('/', authMiddleware, (req, res) => {
  const { propertyId } = req.query;
  const alerts = store.getAlerts(propertyId);
  res.json({ alerts });
});

/**
 * GET /api/alerts/active
 * Returns only active alerts.
 */
router.get('/active', authMiddleware, (req, res) => {
  const { propertyId } = req.query;
  const alerts = store.getActiveAlerts(propertyId);
  res.json({ alerts, count: alerts.length });
});

/**
 * PATCH /api/alerts/:id/resolve
 * Resolves an alert and resets sensor state if no other critical alerts remain.
 */
router.patch('/:id/resolve', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { propertyId } = req.body;

  const resolved = simulator.resolveAlert(id, propertyId || 'p1');
  if (!resolved) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  res.json({ message: 'Alert resolved successfully', alert: resolved });
});

module.exports = router;
