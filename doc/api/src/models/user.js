const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

// Índex per millorar rendiment en consultes per email
userSchema.index({ email: 1 });

//Hash automàtic abans de guardar l'usuari
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Només si es modifica la contrasenya
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//comparar contrasenyes
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
