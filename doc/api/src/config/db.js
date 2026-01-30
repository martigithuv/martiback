// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI no definido en .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB conectado correctamente');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1); // Detener el servidor si falla la conexión
  }
};

module.exports = connectDB;
