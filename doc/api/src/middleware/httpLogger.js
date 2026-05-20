const pinoHttp = require('pino-http');
const logger = require('../config/logger');

const httpLogger = pinoHttp({
  logger,
  genReqId: function (req) {
    return req.requestId;
  },
  customProps: function (req, res) {
    return {
      requestId: req.requestId,
      userId: req.user?.userId || null
    };
  },
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: function (req, res) {
    return `${req.method} ${req.url} completed with status ${res.statusCode}`;
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} failed with status ${res.statusCode}`;
  }
});

module.exports = httpLogger;
