// routes/comandaRoutes.js
const express = require('express');
const comandaController = require('../controllers/comandaController');
const router = express.Router();

// Rutas base: /api/comandes

// POST /api/comandes -> Crea una nueva comanda
router.post('/', comandaController.createComandaHandler);

// GET /api/comandes -> Obtiene todas las comandas (con filtro opcional por userId)
router.get('/', comandaController.getAllComandasHandler);

// GET /api/comandes/:id -> Obtiene una comanda por ID
router.get('/:id', comandaController.getComandaByIdHandler);

// PUT /api/comandes/:id -> Actualiza el estado de una comanda
router.put('/:id', comandaController.updateComandaHandler);

// DELETE /api/comandes/:id -> Elimina una comanda
router.delete('/:id', comandaController.deleteComandaHandler);

module.exports = router;