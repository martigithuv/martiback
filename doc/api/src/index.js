const express = require('express');
const connectDB = require('./config/db'); 
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

connectDB()
  .then(() => console.log("MongoDB connectat correctament"))
  .catch((err) => console.error("Error connectant a MongoDB:", err));

// Ruta principal
app.get('/', (req, res) => {
  res.send('API Ecommerce + Sessió 8 JWT/Refresh activa i funcionant');
});

app.use('/api/products', productRoutes);

app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));

module.exports = app;