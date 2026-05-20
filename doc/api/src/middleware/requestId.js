const { v4: uuidv4 } = require('uuid');

const requestId = (req, res, next) => {
  const incomingRequestId = req.headers['x-request-id'];
  req.requestId = incomingRequestId || uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
};

module.exports = requestId;
