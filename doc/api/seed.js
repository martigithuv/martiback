const mongoose = require('mongoose');
const Product = require('./src/models/product');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/ecommerce');
  console.log('Seed: MongoDB conectado');

  await Product.deleteMany({});
  console.log('Seed: Colección limpiada para restaurar IDs exactos');

  const products = [
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a1'), name: 'Nike Mercurial Aero X', price: 189.99, stock: 50, category: 'roba', brand: 'Nike', image: './public/botas2.jpg', description: 'Bota ultra lleugera' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a2'), name: 'Nike Phantom Control Pro', price: 120.99, stock: 50, category: 'roba', brand: 'Nike', image: './public/nikep2.png', description: 'Control y pasada' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a3'), name: 'Adidas Predator Impact', price: 110.5, stock: 50, category: 'roba', brand: 'Adidas', image: './public/bota1.jpg', description: 'Potencia' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a4'), name: 'Adidas Elite Control', price: 189.99, stock: 50, category: 'roba', brand: 'Adidas', image: './public/adidasp6.png', description: 'Clase' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a5'), name: 'Nike Pro Speedstrike', price: 199.99, stock: 50, category: 'roba', brand: 'Nike', image: './public/nikep4.png', description: 'Agilidad' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a6'), name: 'Puma Future Flex', price: 105.75, stock: 50, category: 'roba', brand: 'Puma', image: './public/pumap4.png', description: 'Futuro' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a7'), name: 'Puma Future Play', price: 179.99, stock: 50, category: 'roba', brand: 'Puma', image: './public/pumap7.png', description: 'Flexibilidad' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a8'), name: 'Adidas Copa Pulse', price: 209.99, stock: 50, category: 'roba', brand: 'Adidas', image: './public/adidasp8.png', description: 'Tacte clasico' },
    { _id: new mongoose.Types.ObjectId('672f2a0c9a12b4e3d3b8f1a9'), name: 'Puma Ultra Sprint', price: 169.99, stock: 50, category: 'roba', brand: 'Puma', image: './public/pumap9.png', description: 'Rapidez' }
  ];

  const mappedProducts = products.map(p => ({
    ...p,
    nombre: p.name,
    precio: p.price,
    imagen: p.image
  }));

  await Product.insertMany(mappedProducts);
  console.log('Seed: Productos restaurados con IDs exactos y fotos correctas.');
  mongoose.disconnect();
}
seed();
