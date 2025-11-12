const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom de la categoria és obligatori'],
    unique: true,
    minlength: [2, 'El nom ha de tenir almenys 2 caràcters'],
    maxlength: [50, 'El nom no pot superar els 50 caràcters']
  },
  description: {
    type: String,
    maxlength: [200, 'La descripció no pot superar els 200 caràcters']
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);