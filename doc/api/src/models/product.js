const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom del producte és obligatori'],
    minlength: [2, 'El nom ha de tenir almenys 2 caràcters']
  },
  description: {
    type: String,
    maxlength: [300, 'La descripció no pot superar els 300 caràcters']
  },
  price: {
    type: Number,
    required: [true, 'El preu és obligatori'],
    min: [0, 'El preu no pot ser negatiu'],
    validate: {
      validator: function (v) {
        return /^\d+(\.\d{1,2})?$/.test(v);
      },
      message: props => `${props.value} no és un preu vàlid`
    }
  },
  category: {
    type: String,
    enum: ['electrònica', 'roba', 'alimentació', 'altres'],
    default: 'altres'
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'L’estoc no pot ser negatiu']
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema);