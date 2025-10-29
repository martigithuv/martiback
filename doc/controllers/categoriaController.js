// controllers/categoryController.js
const categoryService = require('../services/categoryService');

/**
 * Crea una nueva categoría. (POST /api/categories)
 */
const createCategoryHandler = async (req, res) => {
    try {
        const newCategory = await categoryService.createCategory(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', details: error.message });
        }
        if (error.code === 11000) { // Error de índice único duplicado (nombre)
            return res.status(409).json({ message: 'La categoría ya existe.' });
        }
        res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
    }
};

/**
 * Obtiene todas las categorías. (GET /api/categories)
 */
const getAllCategoriesHandler = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorías', error: error.message });
    }
};

/**
 * Obtiene una categoría por ID. (GET /api/categories/:id)
 */
const getCategoryByIdHandler = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.status(200).json(category);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de categoría no válido.' });
        }
        res.status(500).json({ message: 'Error al obtener la categoría', error: error.message });
    }
};

/**
 * Actualiza una categoría por ID. (PUT /api/categories/:id)
 */
const updateCategoryHandler = async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de categoría no válido.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación al actualizar', details: error.message });
        }
        res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
    }
};

/**
 * Elimina una categoría por ID. (DELETE /api/categories/:id)
 */
const deleteCategoryHandler = async (req, res) => {
    try {
        const deletedCategory = await categoryService.deleteCategory(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.status(204).send();
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de categoría no válido.' });
        }
        res.status(500).json({ message: 'Error al eliminar la categoría', error: error.message });
    }
};

module.exports = {
    createCategoryHandler,
    getAllCategoriesHandler,
    getCategoryByIdHandler,
    updateCategoryHandler,
    deleteCategoryHandler
};