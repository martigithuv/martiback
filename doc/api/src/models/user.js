const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom es obligatori'],
    minlength: [2, 'El nom ha de tenir almenys 2 caracters'],
    maxlength: [50, 'El nom no pot superar els 50 caracters']
  },
  email: {
    type: String,
    required: [true, 'El correu es obligatori'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'El format del correu no es valid']
  },
  aceptaTerminos: {
    type: Boolean,
    required: [true, 'Cal acceptar la politica de privacidad'],
    default: false
  },
  aceptaPublicidad: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [true, 'La contrasenya es obligatoria'],
    minlength: [6, 'La contrasenya ha de tenir almenys 6 caracters']
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  refreshTokens: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ email: 1 });

const isBcryptHash = (value) => typeof value === 'string' && value.startsWith('$2');

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password || isBcryptHash(this.password)) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);

