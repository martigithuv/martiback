// services/comandaService.js
const Comanda = require('../models/comanda'); 

/**
 * Función para crear una nueva comanda.
 * Nota: En una aplicación real, esta función debería validar stock y calcular el import_total.
 * @param {object} comandaData - Los datos de la comanda.
 * @returns {Promise<Comanda>} La comanda creada.
 */
const createComanda = async (comandaData) => {
    // Lógica importante aquí:
    // 1. Verificar stock de cada producto en detall_comanda.
    // 2. Si hay stock, restar las cantidades del stock del producto.
    // 3. Recalcular 'import_total' para asegurar que el cliente no lo manipule.
    
    const newComanda = new Comanda(comandaData);
    return await newComanda.save();
};

/**
 * Función para obtener todas las comandas.
 * @param {string} [userId] - Opcional. Si se proporciona, filtra por el usuario.
 * @returns {Promise<Array<Comanda>>} Una lista de comandas.
 */
const getAllComandas = async (userId = null) => {
    let filter = {};
    if (userId) {
        // Filtrar por el ID del usuario
        filter.id_usuari = userId;
    }
    
    // Usamos .populate para obtener la información del usuario y los productos (solo ID, nombre, etc.)
    return await Comanda.find(filter)
        .populate('id_usuari', 'name email') // Popular el usuario
        .populate('detall_comanda.id_producte', 'name price'); // Popular los productos
};

/**
 * Función para obtener una comanda por su ID.
 * @param {string} comandaId - El ID de la comanda.
 * @returns {Promise<Comanda>} La comanda encontrada o null.
 */
const getComandaById = async (comandaId) => {
    return await Comanda.findById(comandaId)
        .populate('id_usuari', 'name email')
        .populate('detall_comanda.id_producte', 'name price');
};

/**
 * Función para actualizar el estado de una comanda por su ID.
 * @param {string} comandaId - El ID de la comanda.
 * @param {object} updateData - Los datos a actualizar (normalmente solo 'estat').
 * @returns {Promise<Comanda>} La comanda actualizada.
 */
const updateComanda = async (comandaId, updateData) => {
    // Nota: Solo permitimos actualizar el estado y campos específicos.
    // No deberías permitir cambiar productos o total una vez creada.
    const allowedUpdates = {
        estat: updateData.estat 
        // ... otros campos como tracking_code del enviament, si se gestiona aquí
    };

    return await Comanda.findByIdAndUpdate(
        comandaId, 
        allowedUpdates, 
        { new: true, runValidators: true }
    );
};

/**
 * Función para eliminar una comanda (generalmente solo para administradores).
 * @param {string} comandaId - El ID de la comanda.
 * @returns {Promise<Comanda>} La comanda eliminada.
 */
const deleteComanda = async (comandaId) => {
    // Lógica importante aquí:
    // Si se elimina, se debe devolver el stock de los productos.
    return await Comanda.findByIdAndDelete(comandaId);
};

module.exports = {
    createComanda,
    getAllComandas,
    getComandaById,
    updateComanda,
    deleteComanda
};