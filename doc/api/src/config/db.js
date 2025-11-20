require('dotenv').config(); 

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔍 [db.js] process.env.MONGODB_URI:', process.env.MONGODB_URI ? `✅ Definido: ${process.env.MONGODB_URI}` : '❌ NO DEFINIDO');

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está definido en las variables de entorno. Revisa tu archivo .env.');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connectat correctament');
  } catch (err) {
    console.error('❌ Error de connexió a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;