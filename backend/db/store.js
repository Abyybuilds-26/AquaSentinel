/**
 * AquaSentinel — In-memory data store
 * Acts as the database for the prototype.
 * Seeded with demo properties, users, and 7 days of sensor readings.
 */

const bcryptSync = (password) => `hashed_${password}`; // demo only

// ─── Demo Users ──────────────────────────────────────────────────────────────
const users = [
  {
    id: 'u1',
    name: 'Ravi Shetty',
    email: 'owner@aquasentinel.com',
    password: 'owner123',
    role: 'owner',
    propertyId: 'p1',
    avatar: 'RS',
  },
  {
    id: 'u2',
    name: 'Priya Nair',
    email: 'resident@aquasentinel.com',
    password: 'resident123',
    role: 'resident',
    propertyId: 'p1',
    avatar: 'PN',
  },
  {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@aquasentinel.com',
    password: 'admin123',
    role: 'admin',
    propertyId: null,
    avatar: 'AU',
  },
];

// ─── Properties (with lat/lng near Mangalore, India) ─────────────────────────
const properties = [
  {
    id: 'p1',
    name: 'Green Valley PG',
    address: '14, MG Road, Kodialbail',
    city: 'Mangalore',
    latitude: 12.8698,
    longitude: 74.8431,
    ownerId: 'u1',
    tankCapacity: 5000,
    waterTariff: 0.04, // ₹ per litre
    status: 'normal', // normal | warning | critical | offline
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'p2',
    name: 'Sunrise Hostel',
    address: '7, Falnir Road',
    city: 'Mangalore',
    latitude: 12.8775,
    longitude: 74.8555,
    ownerId: 'u1',
    tankCapacity: 8000,
    waterTariff: 0.04,
    status: 'warning',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'p3',
    name: 'Royal PG',
    address: '3, Balmatta Road',
    city: 'Mangalore',
    latitude: 12.8621,
    longitude: 74.8373,
    ownerId: 'u1',
    tankCapacity: 3000,
    waterTariff: 0.05,
    status: 'normal',
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'p4',
    name: 'City View PG',
    address: '22, Hampankatta Circle',
    city: 'Mangalore',
    latitude: 12.8673,
    longitude: 74.8485,
    ownerId: 'u1',
    tankCapacity: 6000,
    waterTariff: 0.04,
    status: 'offline',
    createdAt: new Date('2024-04-05').toISOString(),
  },
  {
    id: 'p5',
    name: 'Harbor Heights PG',
    address: '9, Bunts Hostel Road',
    city: 'Mangalore',
    latitude: 12.8834,
    longitude: 74.8402,
    ownerId: 'u1',
    tankCapacity: 4000,
    waterTariff: 0.04,
    status: 'normal',
    createdAt: new Date('2024-05-12').toISOString(),
  },
];

// ─── Live Sensor State (mutable) ──────────────────────────────────────────────
let sensorState = {
  propertyId: 'p1',
  scenario: 'normal',
  flowRate: 4.2,       // L/min
  tankLevel: 72,       // %
  leakDetected: false,
  overflowDetected: false,
  connectionStatus: 'online', // online | offline
  lastUpdated: new Date().toISOString(),
};

// ─── Alerts ───────────────────────────────────────────────────────────────────
let alerts = [
  {
    id: 'a1',
    propertyId: 'p1',
    type: 'HIGH_USAGE',
    severity: 'warning',
    message: 'Unusually high water consumption detected during peak hours.',
    estimatedWasteLiters: 95,
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
  },
  {
    id: 'a2',
    propertyId: 'p2',
    type: 'HIGH_USAGE',
    severity: 'warning',
    message: 'Water usage 40% above weekly average.',
    estimatedWasteLiters: 120,
    status: 'active',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
  },
  {
    id: 'a3',
    propertyId: 'p1',
    type: 'LEAK',
    severity: 'critical',
    message: 'Continuous abnormal flow detected. Possible pipe leak.',
    estimatedWasteLiters: 185,
    status: 'resolved',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Generate 7-day historical readings ───────────────────────────────────────
function generateWeeklyReadings() {
  const readings = [];
  const now = Date.now();
  const dailyBase = [1240, 980, 1450, 1100, 1380, 1020, 1590]; // L per day

  for (let d = 6; d >= 0; d--) {
    const dayStart = new Date(now - d * 24 * 60 * 60 * 1000);
    dayStart.setHours(0, 0, 0, 0);
    const totalUsage = dailyBase[6 - d];

    // 24 hourly readings
    for (let h = 0; h < 24; h++) {
      // usage peaks at 7am and 7pm
      const peakFactor = h >= 6 && h <= 9 ? 1.8 : h >= 18 && h <= 21 ? 1.5 : 0.6;
      const hourlyUsage = Math.round((totalUsage / 24) * peakFactor * (0.9 + Math.random() * 0.2));
      readings.push({
        id: `r_${d}_${h}`,
        propertyId: 'p1',
        flowRate: +(2 + Math.random() * 4).toFixed(1),
        tankLevel: Math.round(60 + Math.random() * 30),
        leakDetected: false,
        overflowDetected: false,
        hourlyUsageLiters: hourlyUsage,
        timestamp: new Date(dayStart.getTime() + h * 60 * 60 * 1000).toISOString(),
      });
    }
  }
  return readings;
}

const sensorReadings = generateWeeklyReadings();

// ─── Resident Usage (demo) ────────────────────────────────────────────────────
const residentUsage = {
  today: 38,
  pgAverage: 42,
  weeklyAvg: 41,
  monthly: 1240,
  monthlyAvg: 1350,
  dailyHistory: [35, 42, 38, 45, 39, 41, 38], // last 7 days
};

// ─── Accessors ────────────────────────────────────────────────────────────────
const store = {
  // Users
  findUserByEmail: (email) => users.find((u) => u.email === email),
  findUserById: (id) => users.find((u) => u.id === id),

  // Properties
  getAllProperties: () => properties,
  getPropertyById: (id) => properties.find((p) => p.id === id),
  updatePropertyStatus: (id, status) => {
    const prop = properties.find((p) => p.id === id);
    if (prop) prop.status = status;
    return prop;
  },

  // Sensor State
  getSensorState: () => ({ ...sensorState }),
  setSensorState: (updates) => {
    sensorState = { ...sensorState, ...updates, lastUpdated: new Date().toISOString() };
    return { ...sensorState };
  },

  // Alerts
  getAlerts: (propertyId) =>
    propertyId ? alerts.filter((a) => a.propertyId === propertyId) : alerts,
  getActiveAlerts: (propertyId) =>
    alerts.filter((a) => a.status === 'active' && (!propertyId || a.propertyId === propertyId)),
  addAlert: (alert) => {
    alerts.unshift(alert);
    return alert;
  },
  resolveAlert: (id) => {
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date().toISOString();
    }
    return alert;
  },

  // Readings / Analytics
  getReadings: (propertyId) =>
    sensorReadings.filter((r) => r.propertyId === propertyId),
  getDailyUsage: () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayTotals = [1240, 980, 1450, 1100, 1380, 1020, 1590];
    return days.map((day, i) => ({ day, usage: dayTotals[i] }));
  },
  getHourlyUsage: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sensorReadings
      .filter((r) => new Date(r.timestamp) >= today)
      .map((r) => ({
        hour: `${new Date(r.timestamp).getHours()}:00`,
        usage: r.hourlyUsageLiters,
      }));
  },

  // Resident
  getResidentUsage: () => ({ ...residentUsage }),
};

module.exports = store;
