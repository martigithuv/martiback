// routes/enviamentRoutes.js
const express = require('express');
const enviamentController = require('../controllers/enviamentController');
const router = express.Router();

// Rutas base: /api/enviaments

// POST /api/enviaments -> Crea un nou enviament
router.post('/', enviamentController.createEnviamentHandler);

// GET /api/enviaments -> Obté tots els enviaments
router.get('/', enviamentController.getAllEnviamentsHandler);

// GET /api/enviaments/:id -> Obté un enviament per ID d'Enviament
router.get('/:id', enviamentController.getEnviamentByIdHandler);

// GET /api/enviaments/comanda/:comandaId -> Obté un enviament per ID de Comanda
router.get('/comanda/:comandaId', enviamentController.getEnviamentByComandaIdHandler);

// PUT /api/enviaments/:id -> Actualitza l'estat o les dades de l'enviament
router.put('/:id', enviamentController.updateEnviamentHandler);

module.exports = router;