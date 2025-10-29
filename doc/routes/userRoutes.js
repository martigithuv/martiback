// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Rutas base: /api/users

// POST /api/users -> Crea un nuevo usuario
router.post('/', userController.createUserHandler);

// GET /api/users -> Obtiene todos los usuarios
router.get('/', userController.getAllUsersHandler);

// GET /api/users/:id -> Obtiene un usuario por ID
router.get('/:id', userController.getUserByIdHandler);

// PUT /api/users/:id -> Actualiza un usuario por ID
router.put('/:id', userController.updateUserHandler);

// DELETE /api/users/:id -> Elimina un usuario por ID
router.delete('/:id', userController.deleteUserHandler);

module.exports = router;