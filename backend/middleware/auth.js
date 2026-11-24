const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aquasentinel_secret_2024';

/**
 * Middleware: verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
}

/**
 * Role-based access guard.
 * Usage: requireRole('owner') or requireRole(['owner', 'admin'])
 */
function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole, JWT_SECRET };
