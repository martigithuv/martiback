// services/userService.js
const User = require('../models/user');
// Si usas bcrypt para hashear passwords, deberías importarlo aquí.
// const bcrypt = require('bcrypt'); 
// const saltRounds = 10;

/**
 * Función para crear un nuevo usuario.
 * @param {object} userData - Los datos del usuario.
 * @returns {Promise<User>} El usuario creado.
 */
const createUser = async (userData) => {
    // Aquí es donde usualmente hashearías la contraseña antes de guardar
    // if (userData.password) {
    //     userData.password = await bcrypt.hash(userData.password, saltRounds);
    // }
    
    const newUser = new User(userData);
    return await newUser.save();
};

/**
 * Función para obtener todos los usuarios.
 * @returns {Promise<Array<User>>} Una lista de todos los usuarios.
 */
const getAllUsers = async () => {
    // Excluímos el campo 'password' por seguridad en las consultas de listado.
    return await User.find().select('-password');
};

/**
 * Función para obtener un usuario por su ID.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<User>} El usuario encontrado o null.
 */
const getUserById = async (userId) => {
    // Excluímos el campo 'password'.
    return await User.findById(userId).select('-password');
};

/**
 * Función para actualizar un usuario por su ID.
 * @param {string} userId - El ID del usuario.
 * @param {object} updateData - Los datos a actualizar.
 * @returns {Promise<User>} El usuario actualizado.
 */
const updateUser = async (userId, updateData) => {
    // Si la contraseña se actualiza, también debería hashearse aquí.
    // if (updateData.password) {
    //     updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    // }
    
    return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
};

/**
 * Función para eliminar un usuario por su ID.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<User>} El usuario eliminado.
 */
const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};