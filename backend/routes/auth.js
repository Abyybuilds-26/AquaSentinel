const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const store = require('../db/store');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = store.findUserByEmail(email.toLowerCase().trim());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    propertyId: user.propertyId,
    avatar: user.avatar,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    token,
    user: payload,
  });
});

/**
 * POST /api/auth/logout (stateless — client just discards the token)
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
