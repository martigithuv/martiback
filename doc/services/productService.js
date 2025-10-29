const Product = require('../models/product.js'); 
const createProduct = async (productData) => { 
    const newProduct = new Product(productData); 
    return await newProduct.save(); 
}; 
module.exports = { 
    createProduct, 
}; 
