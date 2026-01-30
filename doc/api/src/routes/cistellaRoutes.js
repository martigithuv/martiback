// src/routes/cistellaRoutes.js
import express from 'express';
import { getCistella, afegirProducte, eliminarProducte, buidarCistella, actualitzarQuantitat } from '../controllers/cistellaController.js';

const router = express.Router();

router.get('/:userId', getCistella);
router.post('/afegir', afegirProducte);
router.delete('/eliminar/:itemId', eliminarProducte);
router.delete('/buidar/:userId', buidarCistella);
router.put('/actualitzar', actualitzarQuantitat);

export default router;
