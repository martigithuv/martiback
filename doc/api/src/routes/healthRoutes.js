const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Health check endpoint - público
router.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoStatus === 1 ? 'connected' : 'disconnected'
  });
});

// Metrics endpoint - protegides
router.get(
  '/metrics',
  authMiddleware,
  roleMiddleware('admin'),
  (req, res) => {
    const memoryUsage = process.memoryUsage();

    res.json({
      uptime: process.uptime(),
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external
      },
      cpu: process.cpuUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV
    });
  }
);

module.exports = router;
