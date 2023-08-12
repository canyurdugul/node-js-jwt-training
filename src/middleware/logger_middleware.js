const logger = require("../logging/logging");
const { v4: uuidv4 } = require("uuid");

function loggerMiddleware(req, res, next) {
  var requestId = uuidv4();
  var responseId = uuidv4();

  logger.info(
    "Request from " + req.originalUrl + " with requestId: " + requestId,
    {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      body: req.body,
      requestId: requestId,
    }
  );

  const originalSend = res.send;

  res.send = function (body) {
    logger.info(
      "Response from " + req.originalUrl + " with requestId: " + requestId,
      {
        statusCode: res.statusCode,
        body: body,
        requestId: requestId,
        responseId: responseId,
      }
    );

    originalSend.call(res, body);
  };

  next();
}

module.exports = loggerMiddleware;
