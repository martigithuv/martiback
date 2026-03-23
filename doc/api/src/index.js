require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../../src/docs/swagger');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  console.log('[REQ] ' + req.method + ' ' + req.url);
  next();
});

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.use('/api/auth', authRoutes);
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor backend ejecutandose en http://127.0.0.1:' + PORT);
});
