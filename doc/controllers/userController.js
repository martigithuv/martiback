// controllers/userController.js
const userService = require('../services/userService');

/**
 * Crea un nuevo usuario. (POST /api/users)
 */
const createUserHandler = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        // Manejo de errores de validación de Mongoose o clave duplicada
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', details: error.message });
        }
        if (error.code === 11000) {
             return res.status(409).json({ message: 'El correo electrónico ya existe.' });
        }
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

/**
 * Obtiene todos los usuarios. (GET /api/users)
 */
const getAllUsersHandler = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

/**
 * Obtiene un usuario por ID. (GET /api/users/:id)
 */
const getUserByIdHandler = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        // Maneja errores de ID no válido de Mongoose (CastError)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de usuario no válido.' });
        }
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

/**
 * Actualiza un usuario por ID. (PUT /api/users/:id)
 */
const updateUserHandler = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de usuario no válido.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', details: error.message });
        }
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

/**
 * Elimina un usuario por ID. (DELETE /api/users/:id)
 */
const deleteUserHandler = async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        // Respuesta 204 No Content indica éxito sin cuerpo de respuesta.
        res.status(204).send(); 
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de usuario no válido.' });
        }
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};

module.exports = {
    createUserHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler
};