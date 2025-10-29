// models/comanda.js
const mongoose = require('mongoose');

const comandaSchema = new mongoose.Schema({
  // Nombre del campo 'user' ajustado a 'id_usuari' para coincidir con la jerga del proyecto
  id_usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L’usuari és obligatori']
  },
  // El array 'products' representa el 'detall_comanda' del DER
  detall_comanda: [{
    id_producte: { // id_producte del detall_comanda
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Asumiendo que 'Bota_futbol' se llama 'Product' en Mongoose
      required: [true, 'El producte és obligatori']
    },
    quantitat: { // id_quantitat del detall_comanda
      type: Number,
      required: [true, 'La quantitat és obligatòria'],
      min: [1, 'La quantitat mínima és 1']
    },
    preu_unitari: { // Añadido para guardar el precio al momento de la compra
      type: Number,
      required: [true, 'El preu del producte és obligatori'],
      min: [0, 'El preu no pot ser negatiu']
    }
  }],
  // Nombre del campo 'total' ajustado a 'import_total' para coincidir con el DER
  import_total: {
    type: Number,
    required: [true, 'El total de la comanda és obligatori'],
    min: [0, 'El total no pot ser negatiu']
  },
  // Nombre del campo 'status' ajustado a 'estat' para coincidir con el DER
  estat: {
    type: String,
    enum: ['pendent', 'en procés', 'enviat', 'completat', 'cancel·lat'],
    default: 'pendent'
  },
  // Campo 'data' implícito con timestamps o explícito como hiciste:
  data: { // Campo 'data' del DER
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // Añadir timestamps te da 'createdAt' y 'updatedAt' automáticamente

comandaSchema.index({ id_usuari: 1, data: -1 });

module.exports = mongoose.model('Comanda', comandaSchema);