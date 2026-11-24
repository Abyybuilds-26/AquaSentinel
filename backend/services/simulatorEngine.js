/**
 * AquaSentinel — Sensor Simulator Engine
 *
 * Manages the live sensor state and runs the alert engine.
 * When a scenario is triggered, it updates the store and emits
 * real-time Socket.io events to all connected clients.
 */

const store = require('../db/store');
const { v4: uuidv4 } = (() => {
  try { return require('uuid'); }
  catch { return { v4: () => `id_${Date.now()}_${Math.random().toString(36).slice(2)}` }; }
})();

const ALERT_TYPES = {
  LEAK: {
    type: 'LEAK',
    severity: 'critical',
    message: 'Continuous abnormal flow detected. Possible pipe leak.',
    estimatedWasteLiters: 185,
  },
  OVERFLOW: {
    type: 'OVERFLOW',
    severity: 'critical',
    message: 'Tank overflow imminent. Level has reached 95% capacity.',
    estimatedWasteLiters: 240,
  },
  HIGH_USAGE: {
    type: 'HIGH_USAGE',
    severity: 'warning',
    message: 'Unusually high water consumption detected. Usage is 60% above normal.',
    estimatedWasteLiters: 95,
  },
  LOW_TANK: {
    type: 'LOW_TANK',
    severity: 'warning',
    message: 'Tank level critically low. Refill required soon.',
    estimatedWasteLiters: 0,
  },
  SENSOR_OFFLINE: {
    type: 'SENSOR_OFFLINE',
    severity: 'warning',
    message: 'Sensor has stopped reporting. Check device connection.',
    estimatedWasteLiters: 0,
  },
};

/**
 * Scenario configurations: what sensor values each scenario produces.
 */
const SCENARIOS = {
  normal: {
    flowRate: 4.2,
    tankLevel: 72,
    leakDetected: false,
    overflowDetected: false,
    connectionStatus: 'online',
    scenario: 'normal',
  },
  leak: {
    flowRate: 8.5,
    tankLevel: 58,
    leakDetected: true,
    overflowDetected: false,
    connectionStatus: 'online',
    scenario: 'leak',
  },
  overflow: {
    flowRate: 2.1,
    tankLevel: 97,
    leakDetected: false,
    overflowDetected: true,
    connectionStatus: 'online',
    scenario: 'overflow',
  },
  high_usage: {
    flowRate: 12.8,
    tankLevel: 45,
    leakDetected: false,
    overflowDetected: false,
    connectionStatus: 'online',
    scenario: 'high_usage',
  },
  low_tank: {
    flowRate: 1.2,
    tankLevel: 14,
    leakDetected: false,
    overflowDetected: false,
    connectionStatus: 'online',
    scenario: 'low_tank',
  },
  offline: {
    flowRate: 0,
    tankLevel: null,
    leakDetected: false,
    overflowDetected: false,
    connectionStatus: 'offline',
    scenario: 'offline',
  },
};

/**
 * Map scenario → alert type
 */
const SCENARIO_ALERT_MAP = {
  leak: 'LEAK',
  overflow: 'OVERFLOW',
  high_usage: 'HIGH_USAGE',
  low_tank: 'LOW_TANK',
  offline: 'SENSOR_OFFLINE',
};

/**
 * Map scenario → property status
 */
const SCENARIO_STATUS_MAP = {
  normal: 'normal',
  leak: 'critical',
  overflow: 'critical',
  high_usage: 'warning',
  low_tank: 'warning',
  offline: 'offline',
};

let io = null; // Socket.io instance, set via init()

/**
 * Call this once from index.js to wire up the socket.io instance.
 */
function init(socketIo) {
  io = socketIo;
}

/**
 * Trigger a simulation scenario.
 * Updates sensor state, creates an alert (if applicable), updates property
 * status, and broadcasts all changes via Socket.io.
 */
function triggerScenario(scenarioKey, propertyId = 'p1') {
  if (!SCENARIOS[scenarioKey]) {
    throw new Error(`Unknown scenario: ${scenarioKey}`);
  }

  const scenarioData = SCENARIOS[scenarioKey];

  // 1. Update live sensor state
  const newState = store.setSensorState({
    ...scenarioData,
    propertyId,
  });

  // 2. Update property status
  const newStatus = SCENARIO_STATUS_MAP[scenarioKey] || 'normal';
  store.updatePropertyStatus(propertyId, newStatus);

  // 3. Create alert (if not normal scenario)
  let newAlert = null;
  const alertType = SCENARIO_ALERT_MAP[scenarioKey];
  if (alertType) {
    const alertTemplate = ALERT_TYPES[alertType];
    newAlert = {
      id: `a_${Date.now()}`,
      propertyId,
      ...alertTemplate,
      status: 'active',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };
    store.addAlert(newAlert);
  }

  // 4. Broadcast via Socket.io
  if (io) {
    io.emit('sensor_update', newState);
    io.emit('property_update', store.getAllProperties());
    if (newAlert) {
      io.emit('new_alert', newAlert);
    }
  }

  return { sensorState: newState, alert: newAlert, properties: store.getAllProperties() };
}

/**
 * Resolve an alert: updates store, recalculates property status, broadcasts.
 */
function resolveAlert(alertId, propertyId = 'p1') {
  const resolved = store.resolveAlert(alertId);
  if (!resolved) return null;

  // Recalculate property status based on remaining active alerts
  const activeAlerts = store.getActiveAlerts(propertyId);
  let newStatus = 'normal';
  if (activeAlerts.some((a) => a.severity === 'critical')) newStatus = 'critical';
  else if (activeAlerts.some((a) => a.severity === 'warning')) newStatus = 'warning';

  store.updatePropertyStatus(propertyId, newStatus);

  // If no active critical alerts, reset sensor state to normal
  if (newStatus === 'normal') {
    const normalState = store.setSensorState({
      ...SCENARIOS.normal,
      propertyId,
    });
    if (io) {
      io.emit('sensor_update', normalState);
    }
  }

  if (io) {
    io.emit('property_update', store.getAllProperties());
    io.emit('alert_resolved', { alertId, propertyId, newStatus });
  }

  return resolved;
}

module.exports = { init, triggerScenario, resolveAlert };
