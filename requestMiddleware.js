const { v4: uuidv4 } = require("uuid");

function requestMiddleware(req, res, next) {
  const reqId = uuidv4();
  req.reqId = reqId;

  res.setHeader("X-Request-Id", reqId);

  next();
}

module.exports = requestMiddleware;
