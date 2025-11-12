// services/userService.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const saltRounds = 10;

/**
 * Crea un nou usuari (amb contrasenya hashejada)
 * @param {object} userData - Dades del nou usuari.
 * @returns {Promise<User>} L'usuari creat.
 */
const createUser = async (userData) => {
    // Si ve una contrasenya, la xifrem
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const newUser = new User(userData);
    return await newUser.save();
};

/**
 * Registre d’usuari per a l’autenticació (registre oficial amb validacions)
 */
const registerUser = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('L\'usuari ja existeix');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    return { id: user._id, name: user.name, email: user.email };
};

/**
 * Login d’usuari amb verificació i token JWT
 */
const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Usuari no trobat');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Contrasenya incorrecta');

    // Generem token JWT
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );

    return { message: 'Login correcte', token };
};

/**
 * Obté tots els usuaris (sense mostrar la contrasenya)
 */
const getAllUsers = async () => {
    return await User.find().select('-password');
};

/**
 * Obté un usuari per ID (sense contrasenya)
 */
const getUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

/**
 * Actualitza un usuari per ID
 */
const updateUser = async (userId, updateData) => {
    // Si es modifica la contrasenya, també la tornem a hashejar
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
        .select('-password');
};

/**
 * Elimina un usuari per ID
 */
const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    createUser,
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
