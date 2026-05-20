const Product = require('../models/product');

// Crear producto
exports.createProduct = async (req, res, next) => {
  try {
    req.log.info({
      requestId: req.requestId,
      productName: req.body.name
    }, 'Creating new product');

    const newProduct = await Product.create(req.body);

    req.log.info({
      requestId: req.requestId,
      productId: newProduct._id
    }, 'Product created successfully');

    res.status(201).json(newProduct);
  } catch (error) {
    req.log.error({
      requestId: req.requestId,
      error: error.message
    }, 'Error creating product');
    next(error);
  }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res, next) => {
  try {
    req.log.info({
      requestId: req.requestId
    }, 'Getting product list');

    const products = await Product.find();
    res.json(products);
  } catch (error) {
    req.log.error({
      requestId: req.requestId,
      error: error.message
    }, 'Error getting products');
    next(error);
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res, next) => {
  try {
    req.log.info({
      requestId: req.requestId,
      productId: req.params.id
    }, 'Getting product by ID');

    const product = await Product.findById(req.params.id);
    if (!product) {
      req.log.warn({
        requestId: req.requestId,
        productId: req.params.id
      }, 'Product not found');
      return res.status(404).json({ message: 'Product not found', requestId: req.requestId });
    }
    res.json(product);
  } catch (error) {
    req.log.error({
      requestId: req.requestId,
      productId: req.params.id,
      error: error.message
    }, 'Error getting product');
    next(error);
  }
};

// Actualizar producto por ID
exports.updateProduct = async (req, res, next) => {
  try {
    req.log.info({
      requestId: req.requestId,
      productId: req.params.id
    }, 'Updating product');

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      req.log.warn({
        requestId: req.requestId,
        productId: req.params.id
      }, 'Product not found for update');
      return res.status(404).json({ message: 'Product not found', requestId: req.requestId });
    }

    req.log.info({
      requestId: req.requestId,
      productId: updated._id
    }, 'Product updated successfully');

    res.json(updated);
  } catch (error) {
    req.log.error({
      requestId: req.requestId,
      productId: req.params.id,
      error: error.message
    }, 'Error updating product');
    next(error);
  }
};

// Eliminar producto por ID
exports.deleteProduct = async (req, res, next) => {
  try {
    req.log.info({
      requestId: req.requestId,
      productId: req.params.id
    }, 'Deleting product');

    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      req.log.warn({
        requestId: req.requestId,
        productId: req.params.id
      }, 'Product not found for deletion');
      return res.status(404).json({ message: 'Product not found', requestId: req.requestId });
    }

    req.log.info({
      requestId: req.requestId,
      productId: req.params.id
    }, 'Product deleted successfully');

    res.json({ message: 'Product deleted', requestId: req.requestId });
  } catch (error) {
    req.log.error({
      requestId: req.requestId,
      productId: req.params.id,
      error: error.message
    }, 'Error deleting product');
    next(error);
  }
};
