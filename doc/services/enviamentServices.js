// services/enviamentService.js
const Enviament = require('../models/enviament');

/**
 * Crea un nou enviament.
 * @param {object} enviamentData - Els detalls de l'enviament.
 * @returns {Promise<Enviament>} L'enviament creat.
 */
// @ts-ignore: Para evitar el error TS7006 en VS Code si se usa en un proyecto JS/TS mixto.
const createEnviament = async (enviamentData) => {
    // Nota: Normalment, l'enviament es crea un cop la comanda té l'estat 'en procés' o 'enviat'.
    const newEnviament = new Enviament(enviamentData);
    return await newEnviament.save();
};

/**
 * Obté tots els enviaments.
 * @returns {Promise<Array<Enviament>>} Llista d'enviaments.
 */
const getAllEnviaments = async () => {
    // Popular la comanda associada per context
    return await Enviament.find({}).populate('id_comanda', 'id_usuari estat import_total');
};

/**
 * Obté un enviament per ID.
 * @param {string} enviamentId - ID de l'enviament.
 * @returns {Promise<Enviament>} Enviament trobat.
 */
const getEnviamentById = async (enviamentId) => {
    return await Enviament.findById(enviamentId).populate('id_comanda', 'id_usuari estat import_total');
};

/**
 * Obté un enviament per ID de Comanda.
 * @param {string} comandaId - ID de la Comanda.
 * @returns {Promise<Enviament>} Enviament trobat.
 */
const getEnviamentByComandaId = async (comandaId) => {
    return await Enviament.findOne({ id_comanda: comandaId }).populate('id_comanda', 'id_usuari estat import_total');
};

/**
 * Actualitza l'estat o les dades de l'enviament (p. ex., canvi d'estat o data d'arribada).
 * @param {string} enviamentId - ID de l'enviament.
 * @param {object} updateData - Dades a actualitzar.
 * @returns {Promise<Enviament>} Enviament actualitzat.
 */
const updateEnviament = async (enviamentId, updateData) => {
    return await Enviament.findByIdAndUpdate(
        enviamentId, 
        updateData, 
        { new: true, runValidators: true }
    );
};

// No s'implementa el delete, ja que normalment els enviaments es desactiven o es canvien a 'incident'.

module.exports = {
    createEnviament,
    getAllEnviaments,
    getEnviamentById,
    getEnviamentByComandaId,
    updateEnviament
};