// services/userService.js
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // bcryptjs es más estable en Windows
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 👇 Agrega estos logs para verificar las variables en este archivo
console.log('🔍 ACCESS_TOKEN_SECRET en userService:', process.env.ACCESS_TOKEN_SECRET ? '✅ Definido' : '❌ No definido');
console.log('🔍 REFRESH_TOKEN_SECRET en userService:', process.env.REFRESH_TOKEN_SECRET ? '✅ Definido' : '❌ No definido');

const saltRounds = 10;

/**
 * Crea un nuevo usuario (con contraseña hasheada)
 */
const createUser = async (userData) => {
    if (!userData.password) throw new Error('Falta la contraseña');
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;

    const newUser = new User(userData);
    return await newUser.save();
};

/**
 * Registro de usuario (validación y guardado)
 */
const registerUser = async ({ name, email, password, role }) => {
    if (!name || !email || !password) throw new Error('Falta algún dato obligatorio');
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    return { id: user._id, name: user.name, email: user.email };
};

// =======================
// Sessió 8: JWT
// =======================

const generarAccessToken = (usuario) => {
    if (!usuario) throw new Error('Usuario inválido');
    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error('❌ ERROR: ACCESS_TOKEN_SECRET no está definido en generarAccessToken');
        console.error('🔍 process.env.ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
        throw new Error('ACCESS_TOKEN_SECRET no está definido');
    }

    const payload = { id: usuario._id, email: usuario.email };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

const generarRefreshToken = (usuario) => {
    if (!usuario) throw new Error('Usuario inválido');
    if (!process.env.REFRESH_TOKEN_SECRET) {
        console.error('❌ ERROR: REFRESH_TOKEN_SECRET no está definido en generarRefreshToken');
        console.error('🔍 process.env.REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);
        throw new Error('REFRESH_TOKEN_SECRET no está definido');
    }

    const payload = { id: usuario._id };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

/**
 * Login usuario con validación y generación de tokens
 */
const loginUsuario = async ({ email, password }) => {
    if (!email || !password) throw new Error('Faltan credenciales');
    
    console.log('🔍 Buscando usuario con email:', email); // 👈 Log 1
    
    const user = await User.findOne({ email }).select('+password');
    
    console.log('👤 Usuario encontrado:', user ? user.email : 'No encontrado'); // 👈 Log 2
    if (!user) throw new Error('Usuario o contraseña incorrectos');

    console.log('🔒 Contraseña hasheada en DB:', user.password); // 👈 Log 3
    console.log('🔑 Contraseña enviada:', password); // 👈 Log 4

    const validPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Validación de contraseña:', validPassword); // 👈 Log 5

    if (!validPassword) throw new Error('Usuario o contraseña incorrectos');

    console.log('🔐 Generando ACCESS_TOKEN...'); // 👈 Log 6
    const accessToken = generarAccessToken(user);
    console.log('🔐 Generando REFRESH_TOKEN...'); // 👈 Log 7
    const refreshToken = generarRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    return { accessToken, refreshToken };
};

/**
 * Refresca Access Token usando Refresh Token válido
 */
const refrescarAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error('Falta el refreshToken');

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new Error('Token de refresco inválido o caducado');
    }

    const user = await User.findOne({ _id: decoded.id, refreshTokens: refreshToken });
    if (!user) throw new Error('Acceso denegado. Token no válido o revocado');

    const nuevoRefreshToken = generarRefreshToken(user);
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    user.refreshTokens.push(nuevoRefreshToken);
    await user.save();

    const nuevoAccessToken = generarAccessToken(user);
    return { accessToken: nuevoAccessToken, refreshToken: nuevoRefreshToken };
};

/**
 * Logout usuario: invalida Refresh Token
 */
const logoutUsuario = async (refreshToken) => {
    if (!refreshToken) throw new Error('Falta el refreshToken');
    await User.updateOne(
        { refreshTokens: refreshToken },
        { $pull: { refreshTokens: refreshToken } }
    );
};

// =======================
// CRUD Users
// =======================

const getAllUsers = async () => {
    return await User.find().select('-password');
};

const getUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

const updateUser = async (userId, updateData) => {
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
        .select('-password');
};

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    createUser,
    registerUser,
    loginUsuario,
    refrescarAccessToken,
    logoutUsuario,
    generarAccessToken,
    generarRefreshToken,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};