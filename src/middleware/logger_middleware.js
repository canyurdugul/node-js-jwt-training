const logger = require("../logging/logging");
const { v4: uuidv4 } = require("uuid");

function loggerMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  var requestId = uuidv4();
  var responseId = uuidv4();

  logger.info(
    req.method + " request from " +
      req.username +
      " to " +
      req.originalUrl +
      " with requestId: " +
      requestId,
    {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      body: req.body,
      requestId: requestId,
      username: req.username,
      ipAddress: req.socket.remoteAddress,
    }
  );

  const originalSend = res.send;

  res.send = function (body) {
    var responseText =
      "Response from " +
      req.originalUrl +
      " to username " +
      req.username +
      " with requestId: " +
      requestId;
    var responseObject = {
      statusCode: res.statusCode,
      body: body,
      requestId: requestId,
      responseId: responseId,
      username: req.username,
      ipAddress: req.socket.remoteAddress,
    };

    if (res.statusCode === 500) {
      logger.error(responseText, responseObject);
    } else {
      logger.info(responseText, responseObject);
    }

    res.setHeader("X-RequestId", requestId);
    originalSend.call(res, body);
  };

  next();
}

module.exports = loggerMiddleware;
