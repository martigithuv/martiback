const express = require('express');
const router = express.Router();

// Importamos los controladores
const userController = require('../controllers/userController');

/**
 * =======================
 * AUTH (Sesión 8)
 * =======================
 */

/**
 * @route POST /api/user/register
 * @desc Registra un nuevo usuario con contraseña hasheada
 */
router.post('/register', userController.register);

/**
 * @route POST /api/user/login
 * @desc Inicia sesión, genera Access Token y Refresh Token
 */
router.post('/login', userController.login);

/**
 * @route POST /api/user/refresh
 * @desc Genera nuevos tokens usando un Refresh Token válido (rotación)
 */
router.post('/refresh', userController.refreshToken);

/**
 * @route POST /api/user/logout
 * @desc Invalida / elimina el Refresh Token (logout real)
 */
router.post('/logout', userController.logout);

/**
 * =======================
 * CRUD USERS
 * =======================
 */

/**
 * @route GET /api/user
 * @desc Obtiene todos los usuarios (sin contraseña)
 */
router.get('/', userController.getAllUsers);

/**
 * @route GET /api/user/:id
 * @desc Obtiene un usuario específico (sin contraseña)
 */
router.get('/:id', userController.getUserById);

/**
 * @route PUT /api/user/:id
 * @desc Actualiza un usuario (si cambia password, se re-hashea automáticamente)
 */
router.put('/:id', userController.updateUser);

/**
 * @route DELETE /api/user/:id
 * @desc Elimina un usuario por ID
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
