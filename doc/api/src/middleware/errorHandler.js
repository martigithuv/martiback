const errorHandler = (err, req, res, next) => {
  req.log.error({
    requestId: req.requestId,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  }, 'Unhandled error');

  res.status(err.statusCode || 500).json({
    message: err.message || 'Error intern del servidor',
    requestId: req.requestId
  });
};

module.exports = errorHandler;
