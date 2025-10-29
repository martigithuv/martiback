const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom és obligatori'],
    minlength: [2, 'El nom ha de tenir almenys 2 caràcters'],
    maxlength: [50, 'El nom no pot superar els 50 caràcters']
  },
  email: {
    type: String,
    required: [true, 'El correu és obligatori'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'El format del correu no és vàlid']
  },
  password: {
    type: String,
    required: [true, 'La contrasenya és obligatòria'],
    minlength: [6, 'La contrasenya ha de tenir almenys 6 caràcters']
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);