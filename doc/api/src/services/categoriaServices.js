// services/categoryService.js
const Category = require('../models/category');

/**
 * Función para crear una nueva categoría.
 * @param {object} categoryData - Los datos de la categoría.
 * @returns {Promise<Category>} La categoría creada.
 */
const createCategory = async (categoryData) => {
    const newCategory = new Category(categoryData);
    return await newCategory.save();
};

/**
 * Función para obtener todas las categorías.
 * @returns {Promise<Array<Category>>} Una lista de todas las categorías.
 */
const getAllCategories = async () => {
    // Podrías añadir un filtro para solo devolver 'active: true' si es necesario
    return await Category.find({});
};

/**
 * Función para obtener una categoría por su ID.
 * @param {string} categoryId - El ID de la categoría.
 * @returns {Promise<Category>} La categoría encontrada o null.
 */
const getCategoryById = async (categoryId) => {
    return await Category.findById(categoryId);
};

/**
 * Función para actualizar una categoría por su ID.
 * @param {string} categoryId - El ID de la categoría.
 * @param {object} updateData - Los datos a actualizar.
 * @returns {Promise<Category>} La categoría actualizada.
 */
const updateCategory = async (categoryId, updateData) => {
    return await Category.findByIdAndUpdate(categoryId, updateData, { new: true, runValidators: true });
};

/**
 * Función para eliminar una categoría por su ID.
 * @param {string} categoryId - El ID de la categoría.
 * @returns {Promise<Category>} La categoría eliminada.
 */
const deleteCategory = async (categoryId) => {
    // NOTA: En una app real, verifica que no haya productos usando esta categoría antes de eliminarla.
    return await Category.findByIdAndDelete(categoryId);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};