const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is required`);
  return value;
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  try {
    const payload = jwt.verify(token, requireEnv('ACCESS_TOKEN_SECRET'));
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;
