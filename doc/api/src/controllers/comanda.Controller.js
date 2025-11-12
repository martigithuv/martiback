// controllers/comandaController.js
const comandaService = require('../services/comandaService');

/**
 * Crea una nueva comanda. (POST /api/comandes)
 */
const createComandaHandler = async (req, res) => {
    try {
        const newComanda = await comandaService.createComanda(req.body);
        res.status(201).json(newComanda);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación al crear comanda', details: error.message });
        }
        res.status(500).json({ message: 'Error al crear la comanda', error: error.message });
    }
};

/**
 * Obtiene todas las comandas. (GET /api/comandes)
 * Si se incluye un ID de usuario en la query, filtra por ese usuario.
 */
const getAllComandasHandler = async (req, res) => {
    try {
        // En una app real, se debería verificar si el usuario es 'admin' para ver todas.
        const userId = req.query.userId || null; 
        
        const comandas = await comandaService.getAllComandas(userId);
        res.status(200).json(comandas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las comandas', error: error.message });
    }
};

/**
 * Obtiene una comanda por ID. (GET /api/comandes/:id)
 */
const getComandaByIdHandler = async (req, res) => {
    try {
        const comanda = await comandaService.getComandaById(req.params.id);
        if (!comanda) {
            return res.status(404).json({ message: 'Comanda no encontrada.' });
        }
        // En una app real, verificar que el usuario actual es dueño de la comanda (si no es admin).
        res.status(200).json(comanda);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de comanda no válido.' });
        }
        res.status(500).json({ message: 'Error al obtener la comanda', error: error.message });
    }
};

/**
 * Actualiza una comanda por ID (principalmente el estado). (PUT /api/comandes/:id)
 */
const updateComandaHandler = async (req, res) => {
    try {
        const updatedComanda = await comandaService.updateComanda(req.params.id, req.body);
        if (!updatedComanda) {
            return res.status(404).json({ message: 'Comanda no encontrada.' });
        }
        res.status(200).json(updatedComanda);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de comanda no válido.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación al actualizar', details: error.message });
        }
        res.status(500).json({ message: 'Error al actualizar la comanda', error: error.message });
    }
};

/**
 * Elimina una comanda por ID. (DELETE /api/comandes/:id)
 */
const deleteComandaHandler = async (req, res) => {
    try {
        const deletedComanda = await comandaService.deleteComanda(req.params.id);
        if (!deletedComanda) {
            return res.status(404).json({ message: 'Comanda no encontrada.' });
        }
        res.status(204).send(); 
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de comanda no válido.' });
        }
        res.status(500).json({ message: 'Error al eliminar la comanda', error: error.message });
    }
};

module.exports = {
    createComandaHandler,
    getAllComandasHandler,
    getComandaByIdHandler,
    updateComandaHandler,
    deleteComandaHandler
};