// routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

// Rutas base: /api/categories

// POST /api/categories -> Crea una nueva categoría
router.post('/', categoryController.createCategoryHandler);

// GET /api/categories -> Obtiene todas las categorías
router.get('/', categoryController.getAllCategoriesHandler);

// GET /api/categories/:id -> Obtiene una categoría por ID
router.get('/:id', categoryController.getCategoryByIdHandler);

// PUT /api/categories/:id -> Actualiza una categoría por ID
router.put('/:id', categoryController.updateCategoryHandler);

// DELETE /api/categories/:id -> Elimina una categoría por ID
router.delete('/:id', categoryController.deleteCategoryHandler);

module.exports = router;