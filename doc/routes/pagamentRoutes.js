// routes/pagamentRoutes.js
const express = require('express');
const pagamentController = require('../controllers/pagamentController');
const router = express.Router();

// Rutas base: /api/pagaments

// POST /api/pagaments -> Crea un nou pagament
router.post('/', pagamentController.createPagamentHandler);

// GET /api/pagaments -> Obté tots els pagaments
router.get('/', pagamentController.getAllPagamentsHandler);

// GET /api/pagaments/:id -> Obté un pagament per ID de Pagament
router.get('/:id', pagamentController.getPagamentByIdHandler);

// GET /api/pagaments/comanda/:comandaId -> Obté un pagament per ID de Comanda
router.get('/comanda/:comandaId', pagamentController.getPagamentByComandaIdHandler);

// PUT /api/pagaments/:id -> Actualitza l'estat d'un pagament
router.put('/:id', pagamentController.updatePagamentHandler);

module.exports = router;