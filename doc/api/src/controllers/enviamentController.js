// controllers/enviamentController.js
const enviamentService = require('../services/enviamentService');

/**
 * Crea un nou enviament. (POST /api/enviaments)
 */
const createEnviamentHandler = async (req, res) => {
    try {
        const newEnviament = await enviamentService.createEnviament(req.body);
        res.status(201).json(newEnviament);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validació', details: error.message });
        }
        if (error.code === 11000) { // Comanda o codi de seguiment duplicat
            return res.status(409).json({ message: 'Aquesta comanda ja té un enviament registrat o el codi de seguiment ja existeix.' });
        }
        res.status(500).json({ message: 'Error al crear l\'enviament', error: error.message });
    }
};

/**
 * Obté tots els enviaments. (GET /api/enviaments)
 */
const getAllEnviamentsHandler = async (req, res) => {
    try {
        const enviaments = await enviamentService.getAllEnviaments();
        res.status(200).json(enviaments);
    } catch (error) {
        res.status(500).json({ message: 'Error en obtenir els enviaments', error: error.message });
    }
};

/**
 * Obté un enviament per ID. (GET /api/enviaments/:id)
 */
const getEnviamentByIdHandler = async (req, res) => {
    try {
        const enviament = await enviamentService.getEnviamentById(req.params.id);
        if (!enviament) {
            return res.status(404).json({ message: 'Enviament no trobat.' });
        }
        res.status(200).json(enviament);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Format d\'ID d\'enviament no vàlid.' });
        }
        res.status(500).json({ message: 'Error en obtenir l\'enviament', error: error.message });
    }
};

/**
 * Obté un enviament per ID de Comanda. (GET /api/enviaments/comanda/:comandaId)
 */
const getEnviamentByComandaIdHandler = async (req, res) => {
    try {
        const enviament = await enviamentService.getEnviamentByComandaId(req.params.comandaId);
        if (!enviament) {
            return res.status(404).json({ message: 'Enviament no trobat per a aquesta comanda.' });
        }
        res.status(200).json(enviament);
    } catch (error) {
        res.status(500).json({ message: 'Error en obtenir l\'enviament per comanda', error: error.message });
    }
};

/**
 * Actualitza l'estat o les dades de l'enviament. (PUT /api/enviaments/:id)
 */
const updateEnviamentHandler = async (req, res) => {
    try {
        const updatedEnviament = await enviamentService.updateEnviament(req.params.id, req.body);
        if (!updatedEnviament) {
            return res.status(404).json({ message: 'Enviament no trobat.' });
        }
        res.status(200).json(updatedEnviament);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Format d\'ID d\'enviament no vàlid.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validació en actualitzar', details: error.message });
        }
        res.status(500).json({ message: 'Error en actualitzar l\'enviament', error: error.message });
    }
};

module.exports = {
    createEnviamentHandler,
    getAllEnviamentsHandler,
    getEnviamentByIdHandler,
    getEnviamentByComandaIdHandler,
    updateEnviamentHandler
};