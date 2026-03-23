const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(key + ' no esta configurado en el entorno');
  }
  return value;
};

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const signToken = (payload, secretKeyName, expiresInName, defaults) => {
  const secret = requireEnv(secretKeyName);
  const expiresIn = process.env[expiresInName] || defaults.expiresIn;
  return jwt.sign(payload, secret, { expiresIn });
};

const createAccessToken = (user) =>
  signToken(
    { sub: user._id.toString(), email: user.email, role: user.role },
    'ACCESS_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRY',
    { expiresIn: '15m' }
  );

const createRefreshToken = (userId) =>
  signToken(
    { sub: userId.toString() },
    'REFRESH_TOKEN_SECRET',
    'REFRESH_TOKEN_EXPIRY',
    { expiresIn: '7d' }
  );

const verifyRefreshToken = (token) => {
  const secret = requireEnv('REFRESH_TOKEN_SECRET');
  return jwt.verify(token, secret);
};

const register = async (req, res) => {
  try {
    const { name, email, password, aceptaTerminos, aceptaPublicidad } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }
    if (!aceptaTerminos) {
      return res.status(400).json({ message: 'Debes aceptar la política de privacidad' });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Ese email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      aceptaTerminos: true,
      aceptaPublicidad: !!aceptaPublicidad
    });

    await user.save();
    return res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('register error', error);
    return res.status(500).json({ message: 'Error interno al registrar el usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN BODY]', req.body);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user._id);

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('login error', error);
    return res.status(500).json({ message: 'Error interno durante el login' });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Falta el refresh token' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: 'Refresh token inválido' });
    }

    const accessToken = createAccessToken(user);
    return res.json({ accessToken });
  } catch (error) {
    console.error('refresh error', error);
    return res.status(401).json({ message: 'Refresh token inválido' });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Falta el refresh token' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (user) {
      user.refreshTokens = (user.refreshTokens || []).filter((token) => token !== refreshToken);
      await user.save();
    }
  } catch (error) {
    console.warn('logout - token inválido', error.message);
  }

  return res.json({ message: 'Sesion cerrada correctamente' });
};

module.exports = {
  register,
  login,
  refresh,
  logout
};
