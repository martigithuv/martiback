// src/routes/cistellaRoutes.js
const express = require('express');
const { getCistella, afegirProducte, eliminarProducte, buidarCistella, actualitzarQuantitat } = require('../controllers/cistellaController.js');

const router = express.Router();

router.get('/:userId', getCistella);
router.post('/afegir', afegirProducte);
router.delete('/eliminar/:itemId', eliminarProducte);
router.delete('/buidar/:userId', buidarCistella);
router.put('/actualitzar', actualitzarQuantitat);

module.exports = router;
