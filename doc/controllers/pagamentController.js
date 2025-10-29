// controllers/pagamentController.js
const pagamentService = require('../services/pagamentService');

/**
 * Crea un nou pagament. (POST /api/pagaments)
 */
const createPagamentHandler = async (req, res) => {
    try {
        const newPagament = await pagamentService.createPagament(req.body);
        res.status(201).json(newPagament);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validació', details: error.message });
        }
        if (error.code === 11000) { // Comanda duplicada
            return res.status(409).json({ message: 'Aquesta comanda ja té un pagament registrat.' });
        }
        res.status(500).json({ message: 'Error al crear el pagament', error: error.message });
    }
};

/**
 * Obté tots els pagaments. (GET /api/pagaments)
 */
const getAllPagamentsHandler = async (req, res) => {
    try {
        const pagaments = await pagamentService.getAllPagaments();
        res.status(200).json(pagaments);
    } catch (error) {
        res.status(500).json({ message: 'Error en obtenir els pagaments', error: error.message });
    }
};

/**
 * Obté un pagament per ID. (GET /api/pagaments/:id)
 */
const getPagamentByIdHandler = async (req, res) => {
    try {
        const pagament = await pagamentService.getPagamentById(req.params.id);
        if (!pagament) {
            return res.status(404).json({ message: 'Pagament no trobat.' });
        }
        res.status(200).json(pagament);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Format d\'ID de pagament no vàlid.' });
        }
        res.status(500).json({ message: 'Error en obtenir el pagament', error: error.message });
    }
};

/**
 * Obté un pagament per ID de Comanda. (GET /api/pagaments/comanda/:comandaId)
 */
const getPagamentByComandaIdHandler = async (req, res) => {
    try {
        const pagament = await pagamentService.getPagamentByComandaId(req.params.comandaId);
        if (!pagament) {
            return res.status(404).json({ message: 'Pagament no trobat per a aquesta comanda.' });
        }
        res.status(200).json(pagament);
    } catch (error) {
        res.status(500).json({ message: 'Error en obtenir el pagament per comanda', error: error.message });
    }
};

/**
 * Actualitza l'estat d'un pagament per ID. (PUT /api/pagaments/:id)
 */
const updatePagamentHandler = async (req, res) => {
    try {
        const updatedPagament = await pagamentService.updatePagament(req.params.id, req.body);
        if (!updatedPagament) {
            return res.status(404).json({ message: 'Pagament no trobat.' });
        }
        res.status(200).json(updatedPagament);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Format d\'ID de pagament no vàlid.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validació en actualitzar', details: error.message });
        }
        res.status(500).json({ message: 'Error en actualitzar el pagament', error: error.message });
    }
};

module.exports = {
    createPagamentHandler,
    getAllPagamentsHandler,
    getPagamentByIdHandler,
    getPagamentByComandaIdHandler,
    updatePagamentHandler
};