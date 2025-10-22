const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L’usuari és obligatori']
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producte és obligatori']
    },
    quantity: {
      type: Number,
      required: [true, 'La quantitat és obligatòria'],
      min: [1, 'La quantitat mínima és 1']
    },
    price: {
      type: Number,
      required: [true, 'El preu del producte és obligatori'],
      min: [0, 'El preu no pot ser negatiu']
    }
  }],
  total: {
    type: Number,
    required: [true, 'El total de la comanda és obligatori'],
    min: [0, 'El total no pot ser negatiu']
  },
  status: {
    type: String,
    enum: ['pendent', 'en procés', 'enviat', 'completat', 'cancel·lat'],
    default: 'pendent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
