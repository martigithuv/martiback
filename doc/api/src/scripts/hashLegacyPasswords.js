require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/user');

const isBcryptHash = (value) =>
  typeof value === 'string' && value.startsWith('$2');

const main = async () => {
  await connectDB();
  const users = await User.find({ password: { $exists: true } }).lean();
  let updatedCount = 0;

  for (const user of users) {
    if (!user.password || isBcryptHash(user.password)) {
      continue;
    }

    const hashed = await bcrypt.hash(user.password, 12);
    await User.updateOne({ _id: user._id }, { password: hashed });
    updatedCount += 1;
    console.log(`🔐 Hashed ${user._id}`);
  }

  if (updatedCount === 0) {
    console.log('ℹ️  No se encontraron contraseñas sin hash.');
  } else {
    console.log(`✅ Se han hasheado ${updatedCount} contraseñas.`);
  }

  const roleResult = await User.updateMany(
    { $or: [{ role: { $exists: false } }, { role: null }, { role: '' }] },
    { $set: { role: 'client' } }
  );

  if (roleResult.modifiedCount === 0) {
    console.log('ℹ️  Todos los usuarios ya tenían rol.');
  } else {
    console.log(`✅ Se han establecido roles 'client' en ${roleResult.modifiedCount} usuarios.`);
  }
};

main()
  .catch((err) => {
    console.error('⛔ Error durante el re-hashed de contraseñas:', err);
    process.exit(1);
  })
  .finally(() => {
    mongoose.connection.close();
  });
