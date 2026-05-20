const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { URLSearchParams } = require('url');

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(key + ' no esta configurado en el entorno');
  }
  return value;
};

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const FALLBACK_PAYLOAD_KEYS = ['data', 'body'];
const LOGIN_FIELD_ALIASES = {
  email: ['email', 'correo', 'correoelectronico', 'correo_electronico', 'mail', 'usuario', 'user', 'username'],
  password: ['password', 'pass', 'pwd', 'contrasena', 'contrasenya', 'contraseña', 'clave']
};
const REGISTER_FIELD_ALIASES = {
  name: ['name', 'nombre', 'fullname', 'full_name', 'nombrecompleto', 'nombre_completo'],
  aceptaTerminos: ['aceptaTerminos', 'aceptaterminos', 'acceptTerms', 'accept_terms', 'terminos', 'terminosServicio'],
  aceptaPublicidad: ['aceptaPublicidad', 'aceptapublicidad', 'acceptAdvertising', 'accept_advertising', 'publicidad', 'newsletter']
};
const REFRESH_TOKEN_FIELD_ALIASES = ['refreshToken', 'refresh_token', 'refresh-token', 'token', 'refresh'];

const parseBodyToObject = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  if (Buffer.isBuffer(value)) {
    return parseBodyToObject(value.toString('utf8'));
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return {};
    }
    try {
      return JSON.parse(trimmed);
    } catch {
      const result = {};
      const params = new URLSearchParams(trimmed);
      for (const [key, val] of params) {
        result[key] = val;
      }
      return result;
    }
  }
  return {};
};

const pickFieldValue = (payload, fields) => {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const normalizedPayload = {};
  Object.entries(payload).forEach(([key, value]) => {
    normalizedPayload[key.toLowerCase()] = value;
  });

  for (const field of fields) {
    const candidate = normalizedPayload[field.toLowerCase()];
    if (candidate === undefined || candidate === null) {
      continue;
    }
    if (typeof candidate === 'string') {
      if (candidate.length === 0) {
        continue;
      }
      return candidate;
    }
    return candidate;
  }

  return undefined;
};

const extractFieldFromBody = (body, fieldNames) => {
  const payload = parseBodyToObject(body);
  const directValue = pickFieldValue(payload, fieldNames);
  if (directValue !== undefined) {
    return directValue;
  }

  for (const fallbackKey of FALLBACK_PAYLOAD_KEYS) {
    const nestedPayload = parseBodyToObject(payload[fallbackKey]);
    const nestedValue = pickFieldValue(nestedPayload, fieldNames);
    if (nestedValue !== undefined) {
      return nestedValue;
    }
  }

  return undefined;
};

const stringifyField = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  return undefined;
};

const buildLoginPayload = (body) => ({
  email: stringifyField(extractFieldFromBody(body, LOGIN_FIELD_ALIASES.email)),
  password: stringifyField(extractFieldFromBody(body, LOGIN_FIELD_ALIASES.password))
});

const buildRegisterPayload = (body) => ({
  name: stringifyField(extractFieldFromBody(body, REGISTER_FIELD_ALIASES.name)),
  aceptaTerminos: extractFieldFromBody(body, REGISTER_FIELD_ALIASES.aceptaTerminos),
  aceptaPublicidad: extractFieldFromBody(body, REGISTER_FIELD_ALIASES.aceptaPublicidad)
});

const parseBooleanField = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'on', 'yes', 'si', 'sí'].includes(normalized);
  }
  return false;
};

const extractRefreshTokenFromBody = (body) =>
  stringifyField(extractFieldFromBody(body, REFRESH_TOKEN_FIELD_ALIASES));

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
    { expiresIn: '7m' }
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

const register = async (req, res, next) => {
  try {
    const { email, password } = buildLoginPayload(req.body);
    const { name, aceptaTerminos, aceptaPublicidad } = buildRegisterPayload(req.body);

    const trimmedName = name ? name.trim() : '';
    const trimmedEmail = email ? email.trim() : '';

    if (!trimmedName || !trimmedEmail || !password) {
      req.log.warn({
        requestId: req.requestId,
        email: trimmedEmail
      }, 'Register: missing required fields');
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    const aceptaTerminosBool = parseBooleanField(aceptaTerminos);
    if (!aceptaTerminosBool) {
      req.log.warn({
        requestId: req.requestId,
        email: trimmedEmail
      }, 'Register: terms not accepted');
      return res.status(400).json({ message: 'Debes aceptar la política de privacidad' });
    }

    const normalizedEmail = normalizeEmail(trimmedEmail);
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      req.log.warn({
        requestId: req.requestId,
        email: normalizedEmail
      }, 'Register: email already registered');
      return res.status(409).json({ message: 'Ese email ya está registrado' });
    }

    const user = new User({
      name: trimmedName,
      email: normalizedEmail,
      password: password, // Mongoose pre('save') hook takes care of hashing
      aceptaTerminos: aceptaTerminosBool,
      aceptaPublicidad: parseBooleanField(aceptaPublicidad)
    });

    await user.save();

    req.log.info({
      requestId: req.requestId,
      userId: user._id,
      email: user.email
    }, 'User registered successfully');

    return res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      req.log.error({
        requestId: req.requestId,
        error: error.message
      }, 'Register validation error');
      return res.status(400).json({ message: error.message });
    }
    req.log.error({
      requestId: req.requestId,
      error: error.message
    }, 'Register internal error');
    return res.status(500).json({ message: 'Error interno al registrar el usuario' });
  }
};

const login = async (req, res, next) => {
  try {
    const rawEmail = req.body.email || req.body.user;
    const { password } = req.body;
    const normalizedEmail = normalizeEmail(rawEmail);

    if (!normalizedEmail || !password) {
      req.log.warn({
        requestId: req.requestId,
        email: normalizedEmail
      }, 'Login: missing email or password');
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      req.log.warn({
        requestId: req.requestId,
        email: normalizedEmail
      }, 'Login: user not found');
      return res.status(401).json({ message: 'Email o contrasenya incorrectes' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      req.log.warn({
        requestId: req.requestId,
        email: normalizedEmail,
        userId: user._id
      }, 'Login: invalid password');
      return res.status(401).json({ message: 'Email o contrasenya incorrectes' });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user._id);

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    req.log.info({
      requestId: req.requestId,
      userId: user._id,
      email: user.email
    }, 'User logged in successfully');

    // Guardar tokens en Application
    res.cookie('accessToken', accessToken, {
      maxAge: 7 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

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
    req.log.error({
      requestId: req.requestId,
      error: error.message
    }, 'Login internal error');
    return res.status(500).json({ message: 'Error interno durante el login' });
  }
};

const refresh = async (req, res) => {
  const refreshToken = extractRefreshTokenFromBody(req.body);
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

    res.cookie('accessToken', accessToken, {
      maxAge: 7 * 60 * 1000 // 7 min
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error('refresh error', error);
    return res.status(401).json({ message: 'Refresh token inválido' });
  }
};

const logout = async (req, res, next) => {
  const refreshToken = extractRefreshTokenFromBody(req.body);
  if (!refreshToken) {
    return res.status(400).json({ message: 'Falta el refresh token' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (user) {
      user.refreshTokens = (user.refreshTokens || []).filter((token) => token !== refreshToken);
      await user.save();

      req.log.info({
        requestId: req.requestId,
        userId: user._id
      }, 'User logged out');
    }
  } catch (error) {
    req.log.warn({
      requestId: req.requestId,
      error: error.message
    }, 'Logout - invalid token');
  }

  return res.json({ message: 'Sesion cerrada correctamente' });
};

module.exports = {
  register,
  login,
  refresh,
  logout
};
