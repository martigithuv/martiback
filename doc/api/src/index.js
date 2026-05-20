require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cistellaRoutes = require('./routes/cistellaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const comandaRoutes = require('./routes/comandaRoutes');
const enviamentRoutes = require('./routes/enviamentRoutes');
const pagamentRoutes = require('./routes/pagamentRoutes');
const authController = require('./controllers/authController');

// Logger imports
const requestId = require('./middleware/requestId');
const httpLogger = require('./middleware/httpLogger');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/healthRoutes');

const shouldParseAsText = (req) => {
  const contentType = req.headers['content-type'];
  if (!contentType) {
    return true;
  }
  return contentType.toLowerCase().startsWith('text/plain');
};

connectDB();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.text({ type: shouldParseAsText, limit: '1mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware - IMPORTANT: requestId BEFORE httpLogger
app.use(requestId);
app.use(httpLogger);

// Original auth endpoints mapped directly for fallback
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Mount all modular routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cistella', cistellaRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/comanda', comandaRoutes);
app.use('/api/orders', comandaRoutes);
app.use('/api/enviament', enviamentRoutes);
app.use('/api/pagament', pagamentRoutes);

// Health check routes - MUST be before generic /api routes
app.use('/api', healthRoutes);

// Generic /api routes (checkout)
app.use('/api', comandaRoutes);

app.get('/api/debug/error', (req, res, next) => {
  next(new Error('Error de prova per observabilitat'));
});

// Swagger docs
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
    }
  })
);

// Global error handler - MUST be after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor backend ejecutandose en http://127.0.0.1:' + PORT);
});
