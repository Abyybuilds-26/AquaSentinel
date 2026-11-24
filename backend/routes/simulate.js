const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const simulator = require('../services/simulatorEngine');

const VALID_SCENARIOS = ['normal', 'leak', 'overflow', 'high_usage', 'low_tank', 'offline'];

/**
 * POST /api/simulate
 * Body: { scenario: 'leak' | 'overflow' | 'high_usage' | 'low_tank' | 'offline' | 'normal', propertyId? }
 * Triggers the sensor simulator and broadcasts real-time events.
 */
router.post('/', authMiddleware, (req, res) => {
  const { scenario, propertyId = 'p1' } = req.body;

  if (!scenario) {
    return res.status(400).json({ error: 'Scenario is required' });
  }

  if (!VALID_SCENARIOS.includes(scenario)) {
    return res.status(400).json({
      error: `Invalid scenario. Valid options: ${VALID_SCENARIOS.join(', ')}`,
    });
  }

  try {
    const result = simulator.triggerScenario(scenario, propertyId);
    res.json({
      message: `Scenario '${scenario}' triggered successfully`,
      ...result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
