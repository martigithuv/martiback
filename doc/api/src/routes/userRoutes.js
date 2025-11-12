// routes/userRoutes.js
const express = require('express');
const router = express.Router();

//Importamos los controladores
const userController = require('../controllers/userController');

//RUTA DE AUTENTICACIÓN Y REGISTRO

/**
 * @route POST /api/user/register
 * @desc Registra un nuevo usuario en el sistema.
 */
router.post('/register', userController.createUserHandler);

/**
 * @route POST /api/user/login
 * @desc Inicia sesión para un usuario, devolviendo un token. <--- ¡Ruta Añadida!
 */
router.post('/login', userController.loginUserHandler); // <-- Debes definir 'loginUserHandler' en tu controlador

//RUTES CRUD BASE /api/user (Rutas base para manejo de usuarios)

/**
 * @route GET /api/user
 * @desc Obtiene todos los usuarios (sin datos sensibles).
 */
router.get('/', userController.getAllUsersHandler);

/**
 * @route GET /api/user/:id
 * @desc Obtiene un usuario específico por su ID.
 */
router.get('/:id', userController.getUserByIdHandler);

/**
 * @route PUT /api/user/:id
 * @desc Actualiza la información de un usuario por ID.
 */
router.put('/:id', userController.updateUserHandler);

/**
 * @route DELETE /api/user/:id
 * @desc Elimina un usuario por ID.
 */
router.delete('/:id', userController.deleteUserHandler);

// Exportamos el router
module.exports = router;