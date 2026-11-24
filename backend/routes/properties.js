const express = require('express');
const router = express.Router();
const store = require('../db/store');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/properties
 * Returns all properties with their current status (for map).
 */
router.get('/', authMiddleware, (req, res) => {
  const properties = store.getAllProperties();

  // Enrich with active alert count
  const enriched = properties.map((p) => ({
    ...p,
    activeAlerts: store.getActiveAlerts(p.id).length,
  }));

  res.json({ properties: enriched });
});

/**
 * GET /api/properties/:id
 * Returns a single property with sensor state and active alerts.
 */
router.get('/:id', authMiddleware, (req, res) => {
  const property = store.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const activeAlerts = store.getActiveAlerts(property.id);
  const sensorState = store.getSensorState();

  res.json({
    property,
    activeAlerts: activeAlerts.length,
    sensorState: property.id === sensorState.propertyId ? sensorState : null,
  });
});

module.exports = router;
