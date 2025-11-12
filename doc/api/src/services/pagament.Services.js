// services/pagamentService.js
const Pagament = require('../models/pagament');

/**
 * Crea un nou pagament.
 * @param {object} pagamentData - Els detalls del pagament.
 * @returns {Promise<Pagament>} El pagament creat.
 */
const createPagament = async (pagamentData) => {
    // Nota: En una app real, aquí s'integraria amb una passarel·la de pagament (Stripe, PayPal, etc.)
    const newPagament = new Pagament(pagamentData);
    return await newPagament.save();
};

/**
 * Obté tots els pagaments.
 * @returns {Promise<Array<Pagament>>} Llista de pagaments.
 */
const getAllPagaments = async () => {
    return await Pagament.find({}).populate('id_comanda', 'estat import_total');
};

/**
 * Obté un pagament per ID.
 * @param {string} pagamentId - ID del pagament.
 * @returns {Promise<Pagament>} Pagament trobat.
 */
const getPagamentById = async (pagamentId) => {
    return await Pagament.findById(pagamentId).populate('id_comanda', 'estat import_total');
};

/**
 * Obté un pagament per ID de Comanda.
 * @param {string} comandaId - ID de la Comanda.
 * @returns {Promise<Pagament>} Pagament trobat.
 */
const getPagamentByComandaId = async (comandaId) => {
    return await Pagament.findOne({ id_comanda: comandaId }).populate('id_comanda', 'estat import_total');
};

/**
 * Actualitza l'estat d'un pagament.
 * @param {string} pagamentId - ID del pagament.
 * @param {object} updateData - Dades a actualitzar (normalment només 'estat').
 * @returns {Promise<Pagament>} Pagament actualitzat.
 */
const updatePagament = async (pagamentId, updateData) => {
    // Normalment només es permet canviar l'estat del pagament
    const allowedUpdates = { estat: updateData.estat }; 
    
    return await Pagament.findByIdAndUpdate(
        pagamentId, 
        allowedUpdates, 
        { new: true, runValidators: true }
    );
};

// No s'implementa el delete ja que els pagaments solen ser històrics i no s'eliminen.

module.exports = {
    createPagament,
    getAllPagaments,
    getPagamentById,
    getPagamentByComandaId,
    updatePagament
};